// function lifted from https://gist.github.com/codeguy/6684588
function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

export interface sortingLogic {
	property: string;
	reverse: boolean;
}

export class Contact {
	id: number;
	name: string;
	email: string;
	slug: string;
	company: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;


	constructor(name: string, email: string = null, company: string = null, phone: string = null, address: string = null, city: string = null, state: string = null, zip: string = null) {
		this.name = name;
		email && (this.email = email);
		company && (this.company = company);
		phone && (this.phone = phone);
		address && (this.address = address);
		city && (this.city = city);
		state && (this.state = state);
		zip && (this.zip = zip);
	}

	constructor() {
		// empty constructor for new contacts
	}

	generateSlug() {
		this.slug = string_to_slug(this.name);
	}

	changeContact(editedContact: Contact) {
		this.name = editedContact.name;
		this.email = editedContact.email;
		this.company = editedContact.company;
		this.phone = editedContact.phone;
		this.address = editedContact.address;
		this.city = editedContact.city;
		this.state = editedContact.state;
		this.zip = editedContact.zip;
	}

	copyAddress(exampleAddress: Contact) {
		this.address = exampleAddress.address;
		this.city = exampleAddress.city;
		this.state = exampleAddress.state;
		this.zip = exampleAddress.zip;
	}
	
}