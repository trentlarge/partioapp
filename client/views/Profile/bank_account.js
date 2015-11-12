// Template.bankAccount.events({
// 	'click #stripe-create': function(e, template) {

// 		console.log('creating a new stripe account');

// 		var firstname = template.find('#stripe-firstname').value;
// 		var lastname = template.find('#stripe-lastname').value;
// 		var ssn = template.find('#stripe-ssn').value;
// 		// var routingnumber = template.find('#stripe-routingnumber').value;
// 		var routingnumber = "110000000";
// 		// var bankaccount = template.find('#stripe-bankaccount').value;
// 		var bankaccount = "000123456789";

// 		if(ValidateInputs(firstname, lastname, ssn, routingnumber, bankaccount))
// 		{
// 			PartioLoad.show();
// 			console.log(firstname, lastname, ssn, routingnumber, bankaccount);
// 			Meteor.call('createStripeAccount', firstname, lastname, ssn, routingnumber, bankaccount, Meteor.userId(), function(error, result) {
// 				if (!error)
// 				{
// 					console.log('On successfully completing the transaction, add the book to the inventory');

// 					if(Session.get('BookAddType') == 'MANUAL')
// 					{
// 						AddProductToInventoryManually();
// 					}
// 					else
// 					{
// 						if(Session.get('scanResult') != null)
// 						{
// 							AddProductToInventory();
// 						}
// 					}

// 					PartioLoad.hide();
// 				}
// 				else
// 				{
// 					console.log(error);
// 				}
// 			})
// 		}
// 	}
// });

// function ValidateInputs(strfirstname, strlastname, strssn, strroutingnumber, strbankaccount)
// {
// 	if(!strfirstname ||
// 		strfirstname.length < 1)
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter a valid First Name.');
// 		return false;
// 	}

// 	if(!strlastname ||
// 		strlastname.length < 1)
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter a valid Last Name.');
// 		return false;
// 	}

// 	if(!strssn ||
// 		strssn.length < 1)
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter a valid SSN.');
// 		return false;
// 	}

// 	if(strssn &&
// 		(strssn.length < 4 || strssn.length > 4))
// 	{
// 		showInvalidPopUp('Invalid Inputs', 'Please enter last 4 digits of your SSN.');
// 		return false;
// 	}

// 	return true;
// }

// function showInvalidPopUp(strTitle, strMessage)
// {
// 	IonPopup.show({
//           title: strTitle,
//           template: '<div class="center">'+strMessage+'</div>',
//           buttons:
//           [{
//             text: 'OK',
//             type: 'button-energized',
//             onTap: function()
//             {
//             	IonPopup.close();
//             }
//           }]
//         });
// }

// Template.bankAccount.helpers({
// 	noStripeYet: function() {
// 		if (Meteor.user() && ! Meteor.user().profile.stripeAccount) {
// 			return true;
// 		}
// 	},
// 	stripeAccount: function() {
// 		return Meteor.user().profile.stripeAccount;
// 	}
// });
