
Template.addnewCard.events({
	'submit .newCardForm': function(e) {
		e.preventDefault();
		console.log('> Form submit add new card');

		var nameOut = e.target.name.value;
		var numberOut = e.target.number.value;
		var exp = e.target.expiry.value;
				exp = exp.trim();
				exp = exp.split('/');
		var exp1 = parseInt(exp[0]);
		var exp2 = parseInt(exp[1]);
		var cvcOut = e.target.cvc.value;

		console.log(nameOut, numberOut, exp1, exp2, cvcOut);

		if(!nameOut || !numberOut || !exp1 || !exp2 || !cvcOut){
			alert('Please fill all fields');
			return false;
		}

		PartioLoad.show('Adding a new card');

		//Creating first token (tokens only can be used once)
		Stripe.card.createToken({
			number: numberOut,
			cvc: cvcOut,
			exp_month: exp1,
			exp_year: exp2,
			currency: 'usd',
			name: nameOut,
		}, function(status, firstResponse) {

			if(!firstResponse.id) {
				PartioLoad.hide();
				console.log('some error', status);
				return false;
			}

			//If card is credit, check if there is stripeCustomer and add card only on it.
			if(firstResponse.card.funding == 'credit') {

				Meteor.call('checkStripeCustomer', function(error, result) {
					console.log('>>>>>> [stripe] return checkStripeCustomer');

					//Adding card to customer account
					Meteor.call('addCustomerCard', firstResponse.id, function(error, result){
						console.log('>>>>>> [stripe] return addCustomerCard');
						PartioLoad.hide();

						if(error) {
							alert(error.message);
							return false;
						}

						//closemodal
						$('.modal .bar button').trigger('click');
						Cards.refresh();
					})
				});

			//If card is debit, check if there is stripeManaged and stripeCustomer and add card only both accounts.
			} else if(firstResponse.card.funding == 'debit') {

				//check if there is stripe Managed account
				Meteor.call('checkStripeManaged', function(error, resultManaged) {
					console.log('>>>>>> [stripe] return checkStripeManaged');

					if(error) {
						PartioLoad.hide();
						alert(error.message);
						return false;
					}

					if(resultManaged) {
						Meteor.call('checkStripeCustomer', function(error, resultCustomer) {
							console.log('>>>>>> [stripe] return checkStripeCustomer');
							if(error) {
								PartioLoad.hide();
								alert(error.message);
								return false;
							}

							if(resultCustomer) {

								//Creating second token (tokens only can be used once)
								Stripe.card.createToken({
									number: numberOut,
									cvc: cvcOut,
									exp_month: exp1,
									exp_year: exp2,
									currency: 'usd',
									name: nameOut,
								}, function(status, secondResponse) {

									if(!secondResponse.id) {
										PartioLoad.hide();
										console.log('some error', status);
										return false;
									}

									//On this method we gonna create the same card to Customer and Manager
									//That's why because we have 2 tokens (each token could be used once time)
									Meteor.call('addManagedCard', firstResponse.id, secondResponse.id, function(error, result){
										console.log('>>>>>> [stripe] return addCustomerCard');
										PartioLoad.hide();

										if(error) {
											alert(error.message);
											return false;
										}

										//closemodal
										$('.modal .bar button').trigger('click');

										Cards.refresh();
									})
								});
							}
						})
					}
				});
			}
		});

		//
		// Meteor.call('checkAccount', function(error, result) {
		// 	console.log('>>>>>> return checkaccount <<<<<');
		//
		// 	if(error) {
		// 		PartioLoad.hide();
		// 		console.log(error);
		// 		return false;
		// 	}
		//
		// 	if(result){
		// 		Stripe.card.createToken({
		// 			number: numberOut,
		// 			cvc: cvcOut,
		// 			exp_month: exp1,
		// 			exp_year: exp2,
		// 			currency: 'usd',
		// 			name: nameOut,
		// 		}, function(status, response) {
		//
		// 			if(response.error) {
		// 				PartioLoad.hide();
		// 				alert(response.error.message);
		// 				return false;
		// 			}
		//
		// 			if(response.card.funding == 'credit') {
		// 				PartioLoad.hide();
		// 				alert('Sorry, for now only with debit cards.');
		// 				return false;
		// 			}
		//
		// 			if(response.id) {
		// 				Meteor.call('addCard', response.id, function(error, result){
		// 					console.log('>>>>>> return addCard');
		//
		// 					if(error) {
		// 						alert(error.message);
		// 						return false;
		// 					}
		//
		// 					Cards.refresh();
		//
		// 					//closemodal
		// 					$('.modal .bar button').trigger('click');
		// 					PartioLoad.hide();
		//
		// 				});
		// 			} else {
		// 				PartioLoad.hide();
		// 				console.log('some error');
		// 				console.log(response);
		// 			}
		// 		});
		// 	}
		// });
	}
});
