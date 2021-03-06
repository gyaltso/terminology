/*******************************************************************************
 * Copyright (C) 2013-2020 itemis AG (http://www.itemis.eu).
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *    Alexander Nittka (alex@nittka.de) - initial implementation
 ******************************************************************************/
package de.itemis.tooling.terminology.scoping;

import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.xtext.naming.QualifiedName;
import org.eclipse.xtext.scoping.IScope;
import org.eclipse.xtext.scoping.Scopes;
import org.eclipse.xtext.scoping.impl.AbstractDeclarativeScopeProvider;

import com.google.common.base.Function;

import de.itemis.tooling.terminology.terminology.Author;
import de.itemis.tooling.terminology.terminology.Customer;
import de.itemis.tooling.terminology.terminology.Gr;
import de.itemis.tooling.terminology.terminology.Language;
import de.itemis.tooling.terminology.terminology.Product;
import de.itemis.tooling.terminology.terminology.Status;
import de.itemis.tooling.terminology.terminology.SubjectEntries;
import de.itemis.tooling.terminology.terminology.Terminology;

/**
 * This class contains custom scoping description.
 * 
 * see : http://www.eclipse.org/Xtext/documentation/latest/xtext.html#scoping
 * on how and when to use it 
 *
 */
public class TerminologyScopeProvider extends AbstractDeclarativeScopeProvider {

	private Terminology getTerminology(SubjectEntries entries){
		return (Terminology) entries.getSubject().eContainer();
	}
	public IScope scope_MetaData_status(SubjectEntries entries, EReference ref){
		EList<Status> status = getTerminology(entries).getStatus();
		return Scopes.scopeFor(status, new Function<Status, QualifiedName>() {
			public QualifiedName apply(Status s){
				return QualifiedName.create(s.getName());
			}
		}, IScope.NULLSCOPE);
	}

	public IScope scope_Term_language(SubjectEntries entries, EReference ref){
		EList<Language> languages = getTerminology(entries).getLanguages();
		return Scopes.scopeFor(languages);
	}

	public IScope scope_Entry_missingPreferredTermLangage(SubjectEntries entries, EReference ref){
		EList<Language> languages = getTerminology(entries).getLanguages();
		return Scopes.scopeFor(languages);
	}

	public IScope scope_Entry_relatedEntries(SubjectEntries entries, EReference ref){
		return Scopes.scopeFor(entries.getEntries());
	}

	public IScope scope_Term_gr(SubjectEntries entries, EReference ref){
		EList<Gr> grs = getTerminology(entries).getGrs();
		return Scopes.scopeFor(grs);
	}

	public IScope scope_Term_customers(SubjectEntries entries, EReference ref){
		EList<Customer> customers = getTerminology(entries).getCustomers();
		return Scopes.scopeFor(customers);
	}

	public IScope scope_Term_products(SubjectEntries entries, EReference ref){
		EList<Product> products = getTerminology(entries).getProducts();
		return Scopes.scopeFor(products);
	}

	public IScope scope_MetaData_createdAuthor(SubjectEntries entries, EReference ref){
		return getAuthors(entries);
	}

	public IScope scope_MetaData_modifiedAuthor(SubjectEntries entries, EReference ref){
		return getAuthors(entries);
	}

	private IScope getAuthors(SubjectEntries entries) {
		EList<Author> authors = getTerminology(entries).getAuthors();
		return Scopes.scopeFor(authors);
	}
}
