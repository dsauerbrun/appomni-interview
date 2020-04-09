import { Component, Input } from '@angular/core';
import { Contact, sortingLogic } from './models';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
	contacts: Contact[] = [];
	selectedContact: Contact = null;
	sortingLogic: sortingLogic = null;
	public boundSaveCallback: Function;
	public boundCancelCallback: Function;


	constructor(private activatedRoute: ActivatedRoute, private location: Location) {
	}

	ngOnInit() {
		this.boundSaveCallback = this.save.bind(this);
		this.boundCancelCallback = this.cancel.bind(this);

		// seeding data
		this.contacts.push(new Contact('Daniel', 'dsauerbrun@gmail.com', 'Freelance', '818-254-8697', '123 Fake Street', 'Springfield', '??', '81657'));
		this.contacts[0].id = 1;
		this.contacts[0].generateSlug();
  }

  selectContact(contact: Contact) {
  	this.selectedContact = contact;
  	this.location.replaceState(`/contacts/${contact.slug}`);
  }

  updateSorting(prop: string) {
  	if (this.sortingLogic && this.sortingLogic.prop === prop) {
  		this.sortingLogic.reverse = !this.sortingLogic.reverse;
  	} else {
  		this.sortingLogic = {
  			prop: prop,
  			reverse: false
  		};
  	}
  }

  sortBy() {
  	if (!this.sortingLogic) {
  		return this.contacts;
  	}

  	let prop = this.sortingLogic.prop;
  	let reverse = this.sortingLogic.reverse;

	  let sortedContacts = this.contacts.sort((a, b) => {
	  	let aProp = a[prop] && a[prop].toLowerCase();
	  	let bProp = b[prop] && b[prop].toLowerCase();
	  	return aProp > bProp ? 1 : aProp === bProp ? 0 : -1
	  });

	  if (reverse) {
	  	sortedContacts = sortedContacts.reverse();
	  }

	  return sortedContacts;
	}

  /////////////////////// CRUD utilities

  newContact() {
  	this.selectedContact = new Contact();
  	this.location.replaceState(`/contacts/new`);
  }

  public save(contact: Contact = null) {
  	if (contact) {
  		this.contacts.push(contact);
  		contact.generateSlug();
  	}
  	this.selectedContact = null;
  	this.location.replaceState(`/contacts`);
  }

  public cancel() {
  	this.selectedContact = null;
  	this.location.replaceState(`/contacts`);
  }

}


@Component({
  selector: 'contact-edit',
  templateUrl: 'contactEdit.component.html',
  styleUrls: ['app.component.scss']
})
export class ContactEditComponent {
	@Input() allContacts: Contact[];
	@Input() originalContact: Contact;
	@Input() public saveCallback: Function;
	@Input() public cancelCallback: Function;
	editContact: Contact = null;
	validationError: string = null;

	ngOnInit() {
		this.editContact = new Contact(this.originalContact.name, this.originalContact.email, this.originalContact.company, this.originalContact.phone, this.originalContact.address, this.originalContact.city, this.originalContact.state, this.originalContact.zip);
  }

  companyUpdated() {
  	if (!this.originalContact.id && !this.editContact.address && !this.editContact.city && !this.editContact.state && !this.editContact.zip) {
  		// only autofill address for new contacts and for when address hasn't been filled out
  		let exampleAddress = this.allContacts.find(x => x.company === this.editContact.company);
  		if (exampleAddress) {
  			this.editContact.copyAddress(exampleAddress);
  		}
  	}
  }

  validateContact() {
  	let validationError: string = '';
  	if (!this.editContact.name || this.editContact.name === '') {
  		validationError = 'Name is a required field.';
  	}

  	if (this.validationError === '') {
  		this.validationError = null;
  	} else {
  		this.validationError = validationError;
  	}
  }

  saveContact() {
  	this.validateContact();
  	if (this.validationError) {
  		return;
  	}

  	try {
  		if (this.originalContact.id) {
	  		//editing contact
	  		this.editContact.id = this.originalContact.id;
	  		this.originalContact.changeContact(this.editContact);
	  		this.originalContact = null;
	  		this.saveCallback && this.saveCallback();
	  	} else {
	  		// creating new contact
	  		// spoof Id that i'd get from the server, assume no collisions ever because we're really lucky
	  		this.editContact.id = Math.floor(Math.random() * 10000000);
	  		this.saveCallback && this.saveCallback(this.editContact);
	  	}	  	
  	} catch (err) {
  		this.validationError = err;
  	}
  }

  cancel() {
  	this.cancelCallback && this.cancelCallback();
  }

  
}