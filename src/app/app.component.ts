import { Component, Input } from '@angular/core';
import { Contact, sortingLogic } from './models';
import { ActivatedRoute } from '@angular/router';

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


	constructor(private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
		this.boundSaveCallback = this.save.bind(this);
		this.boundCancelCallback = this.cancel.bind(this);
		this.contacts.push(new Contact('Daniel', 'dsauerbrun@gmail.com', 'Freelance', '818-254-8697', '123 Fake Street', 'Springfield', '??', '81657'));
  }

  selectContact(contact: Contact) {
  	console.log('selecting')
  	this.selectedContact = contact;
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
  }

  public save(contact: Contact = null) {
  	if (contact) {
  		this.contacts.push(contact);
  	}
  	this.selectedContact = null;
  }

  public cancel() {
  	this.selectedContact = null;
  }

}


@Component({
  selector: 'contact-edit',
  templateUrl: 'contactEdit.component.html',
  styleUrls: ['app.component.scss']
})
export class ContactEditComponent {
	@Input() originalContact: Contact;
	@Input() public saveCallback: Function;
	@Input() public cancelCallback: Function;
	editContact: Contact = null;
	validationError: string = null;

	ngOnInit() {
		this.editContact = new Contact(this.originalContact.name, this.originalContact.email, this.originalContact.company, this.originalContact.phone, this.originalContact.address, this.originalContact.city, this.originalContact.state, this.originalContact.zip);
  }

  validateContact() {
  	let validationError: string = '';
  	if (!this.editContact.name || this.editContact.name == '') {
  		validationError = 'Name is a required field.';
  	}

  	if (this.validationError == '') {
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