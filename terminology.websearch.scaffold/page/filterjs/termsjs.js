var fJS;
var currentFilterCount=9999;
var startLength; //1 or 2 depending on data.lenght; marker performance hack

function initFilterList(listLabel, data, includeNone){
  var checkBoxList=$('#'+listLabel);
  if(includeNone){
    var append="<li><input id='"+listLabel+"none' value='none' type='checkbox'><span id='filter_"+listLabel+"none_label'>missing localization</span></li>";
    checkBoxList.append(append);
  }
  for(var i=0; i<data.length; i++){
    var filter=data[i];
    var append="<li><input id='"+listLabel+filter.name+"' value='"+filter.name+"' type='checkbox'><span>"+filter.display+"</span></li>";
    checkBoxList.append(append);
  }
  if(data.length==0 && includeNone || data.length==1 && !includeNone){
    checkBoxList.parent()[0].style.display='none';
  }
  var header=$('#filter_'+listLabel+'_label');
  header.click(function () {
    checkBoxList.slideToggle(0, function () {
      var filterBarHeight=$('.sidebar_bar').height();
      $('.featured_services_find').css('max-height', filterBarHeight+'px');
      $('#details_service').css('max-height', filterBarHeight+'px');
      header.toggleClass("collapsed");
    });
  });
  header.click();
};

function toggleAll(toggleId){
  var checkboxSelector='#'+toggleId +' :checkbox';
  var toggleSelector='#toggle'+toggleId;
  var size=$(checkboxSelector).size();
  if(size<2){
    $(toggleSelector)[0].style.display='none';
  }else{
	  $(toggleSelector).on('click', function(){
	    var toggleButtonId='#toggle'+toggleId;
	    var checkboxSelector='#'+toggleId +' :checkbox';
	    var onOff=$(toggleButtonId).is(":checked");
	    var noneCheckbox='#'+toggleId+'none';
	    $(checkboxSelector).prop('checked', onOff);
	    $(noneCheckbox).prop('checked', true);
	    fJS.filter();//this seems not to be necessary in the example!?
	  });
  }
};

function unselectResultList(){
  $('.resultlist').removeClass('result_selected');
}

jQuery(document).ready(function($) {

  $('.header_name').html(terminology.name);
  initFilterList("customers",terminology.customers, true);
  initFilterList("products",terminology.products, true);
  initFilterList("languages",terminology.languages, false);
  initFilterList("subjects",terminology.subjects, false);

  $('#termstatus :checkbox').prop('checked', true);
  $('#customers :checkbox').prop('checked', true);
  $('#products :checkbox').prop('checked', true);
  $('#languages :checkbox').prop('checked', true);
  $('#subjects :checkbox').prop('checked', true);

  $('#searchAlso input').on('click', function(){
    unselectResultList();
    fJS.initSearch({ele: '#search_box', fields:getSearchFields()});
    fJS.filter();
  });

  $('input').on('change', function(){
    clearDetails();
    unselectResultList();
  });

  $('#search_box').on('keyup', function(e){
    clearDetails();
    unselectResultList();
    //performanc hack; unbound keyup in filter.js line 1244
    //heuristic for automatic filtering:
    //element count small, search text length large
    //or user explicitly calls
    var filterTimer=-1;
    var length=$.trim(this.value).length;
    if(length==1 && startLength!=1){
      //do nothing - no filtering for only one character
    } else if(e.keyCode==13){
      filterTimer=0;
    } else if(currentFilterCount<1000 || length>3){
      filterTimer=35;
    }
    if(filterTimer>=0){
      //$(this).removeClass('dirty');
      fJS.filterTimer(filterTimer);
    } else {
      $(this).addClass('dirty');
    }
  });

  toggleAll('products'); 
  toggleAll('customers'); 
  toggleAll('subjects'); 

  language;//touch localize.js for initializing localization
  fJS=filterInit($);
});

function clearDetails(){
  $('#details .entry').replaceWith(noEntry);
};

function loadEntry(id, termid){
  var content=globalTermDetailMap[id];
  $('#details .entry').replaceWith(content);
  localizeDetails(language);
  unselectResultList();
  $("#result" + termid).addClass("result_selected");
};

function renderTerm(jsonTerm){
  var action="onclick=loadEntry('"+jsonTerm.entry_id+"','"+jsonTerm.id+"')>";
  var id='id="result'+jsonTerm.id+'" ';
  return "<span "+id+"class='resultlist "+jsonTerm.term_status+"' "+action+jsonTerm.term+"</span>";
};

var globalTermDetailMap = {};
var noEntry;

document.addEventListener("DOMContentLoaded", function () {
  $('#hiddenClipBoard').load('data/terms.html', function () {
    $('.entry').each(function () {
      var currentId = $(this).attr('id');
      var currentEntryNode = $(this);
      globalTermDetailMap[currentId] = currentEntryNode;
    });
    $('#hiddenClipBoard').remove();
    noEntry=$('#details .entry');
  });
});

function getSearchFields(){
   var searchFields=['term'];
   var searchInUsage=$('#usage').is(":checked");
   var searchInDefinition=$('#definition').is(":checked");
   if(searchInUsage){
     searchFields.push('usage');
   }
   if(searchInDefinition){
     searchFields.push('entry_definition');
   }
   return searchFields;
};

function filterInit($) {
   var view = function(jsonTerm){
     var result="<div class='result_term'>" + renderTerm(jsonTerm) + "</div>";
     return result;
   };

   currentFilterCount=data.length;
   if(currentFilterCount<500){
     startLength=1;
   } else {
     startLength=2;
   }

  var settings = {
    criterias: [
      {ele: '#termstatus :checkbox', field:'term_status'},
      {ele: '#languages :checkbox', field:'language'},
      {ele: '#subjects :checkbox', field:'subject'},
      {ele: '#customers :checkbox', field:'customers.id'},
      {ele: '#products :checkbox', field:'products.id'},
    ],
    callbacks: {
      afterFilter: function(result){
       currentFilterCount=result.length;
       $('#search_box').removeClass('dirty');
      }
    },
    view: view,
    template:'#template',
    search: {ele: '#search_box', fields:getSearchFields(), start_length:startLength},
    and_filter_on: true,
    id_field: 'id' //Default is id. This is only for usecase
  };
  currentFilterCount=data.length;
  return FilterJS(data, "#service_list", settings);
}
