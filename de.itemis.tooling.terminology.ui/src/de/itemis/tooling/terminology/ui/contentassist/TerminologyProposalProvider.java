/*
* generated by Xtext
*/
package de.itemis.tooling.terminology.ui.contentassist;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.jface.text.contentassist.ICompletionProposal;
import org.eclipse.jface.viewers.StyledString;
import org.eclipse.swt.graphics.Image;
import org.eclipse.xtext.Assignment;
import org.eclipse.xtext.EcoreUtil2;
import org.eclipse.xtext.ui.editor.contentassist.ConfigurableCompletionProposal;
import org.eclipse.xtext.ui.editor.contentassist.ContentAssistContext;
import org.eclipse.xtext.ui.editor.contentassist.ICompletionProposalAcceptor;
import org.eclipse.xtext.ui.editor.contentassist.PrefixMatcher;

import de.itemis.tooling.terminology.terminology.Entry;
import de.itemis.tooling.terminology.terminology.SubjectEntries;
import de.itemis.tooling.terminology.terminology.Term;
/**
 * see http://www.eclipse.org/Xtext/documentation/latest/xtext.html#contentAssist on how to customize content assistant
 */
public class TerminologyProposalProvider extends AbstractTerminologyProposalProvider {

	//propose related entries by allowing typing a term name but inserting the entry id
	@Override
	public void completeEntry_RelatedEntries(EObject model,
			Assignment assignment, ContentAssistContext context,
			ICompletionProposalAcceptor acceptor) {
		SubjectEntries entries=(SubjectEntries) EcoreUtil2.getRootContainer(model);
		for (Entry entry : entries.getEntries()) {
			for (Term term : entry.getTerms()) {
				ICompletionProposal result = null;
				StyledString displayString = getStyledDisplayString(term,term.getName(),term.getName());
				Image image = getImage(term);
				result = createCompletionProposal(entry.getName(), displayString, image, context);
				if (result instanceof ConfigurableCompletionProposal) {
					ConfigurableCompletionProposal typed = (ConfigurableCompletionProposal) result;
					typed.setAdditionalProposalInfo(entry);
					typed.setHover(getHover());
					//check 
					final String termNameLower =term.getName().toLowerCase();
					typed.setMatcher(new PrefixMatcher() {
						@Override
						public boolean isCandidateMatchingPrefix(String name, String prefix) {
							return termNameLower.startsWith(prefix.toLowerCase())||name.startsWith(prefix);
						}
					});
				}
				getPriorityHelper().adjustCrossReferencePriority(result, context.getPrefix());
				acceptor.accept(result);
			}
		}
	}
}
