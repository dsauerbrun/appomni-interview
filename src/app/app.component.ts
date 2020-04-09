import { Component } from '@angular/core';
import { Contact } from './models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
	contacts: Contact[] = [];
	selectedContact: Contact = null;

	constructor(private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
		this.contacts.push(new Contact('Dan'));
  }

  selectContact(contact: Contact) {
  	console.log('selecting')
  	this.selectedContact = contact;
  }


}


@Component({
  selector: 'contact-edit',
  templateUrl: 'contactEdit.component.html' 
})
export class ContactEditComponent {

	ngOnInit() {
		
  }

  
}