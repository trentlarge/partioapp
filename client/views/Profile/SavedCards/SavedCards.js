Template.savedCards.getStripeCustomer = function(done){
	Meteor.call('getStripeCustomer', function(err, result) {
		if(err) {
			var errorMessage = err.reason || err.message;
			if(err.details) {
				errorMessage = errorMessage + "\nDetails:\n" + err.details;
			}
			done(false);
		}
		done(result);
	});
};

Template.savedCards.getStripeManaged = function(done){
	Meteor.call('getStripeManaged', function(err, result){
		if(err) {
			var errorMessage = err.reason || err.message;
			if(err.details) {
				errorMessage = errorMessage + "\nDetails:\n" + err.details;
			}
			done(false);
		}
		done(result);
	});
};

Cards = {
	customer: false,
	managed: false,
	creditCards: 0,
	debitCards: 0,

	//refrshing this object
	refresh: function(){
		PartioLoad.show('Getting cards data...')
		
		var promisse = new Promise(
	      	function(resolve, reject) {
				Template.savedCards.getStripeCustomer(function(dataCustomer){
					Cards.customer = dataCustomer;
					Template.savedCards.getStripeManaged(function(dataManaged){
						Cards.managed = dataManaged;
						resolve();
					});
				});
	      	}
		);

    promisse.then(
      function() {
        Cards.organize();
		PartioLoad.hide();
      })
	},

	organize: function(){
		var _results = [];

		if(Cards.customer) {
			//check Customer cards (could be Credit or Debit)
			if(Cards.customer.sources.data.length){
				Cards.customer.sources.data.map(function(card){
					var _thisObj = {};
					var _defaultPay = '';

					if(card.id == Cards.customer.default_source) {
						_defaultPay = 'default';
					}

					_thisObj.id = card.metadata.idPartioCard;
					_thisObj.funding = card.funding;
					_thisObj.defaultPay = _defaultPay;
					_thisObj.brand = card.brand;
					_thisObj.last4 = card.last4;
					_thisObj.customerCardId = card.id;
					_results.push(_thisObj);
				})
			}
		}

		if(Cards.managed) {
			//check Customer cards (could be only Debit)
			if(Cards.managed.external_accounts.data.length){
				Cards.managed.external_accounts.data.map(function(card){
					var _exists = false;
					var _thisObj = {};
					var _defaultReceive = '';
					var i = 0;
					var index = false;

					if(card.default_for_currency) {
						_defaultReceive = 'default';
					}

					_results.map(function(__card){
						if(!_exists) {
							if(__card.id == card.metadata.idPartioCard){
								_exists = true;
								index = i;
							}
							i++;
						}
					})

					if(!_exists) {
						_thisObj.id = card.metadata.idPartioCard;
						_thisObj.funding = card.funding;
						_thisObj.brand = card.brand;
						_thisObj.last4 = card.last4;
						_thisObj.defaultReceive = _defaultReceive;
						_thisObj.managedCardId.id = card.id;
						_results.push(_thisObj);
					} else {
						_results[index].managedCardId = card.id;
						_results[index].defaultReceive = _defaultReceive;
					}
				})
			}
		}

		Session.set('cardsList', _results);
		Cards.checkStatus();
	},

	//check user situation with the cards
	checkStatus: function(){
		var cardsList = Session.get('cardsList');

		cardsList.map(function(card){
			if(card.funding == 'debit') {
				Cards.debitCards++;

			} else if(card.funding == 'credit') {
				Cards.creditCards++;
			}
		})

		//if there are cards
		if(Cards.debitCards > 0 || Cards.creditCards > 0) {

			//there are debit card(s)
			if(Cards.debitCards > 0) {
				Cards.setStatus('ok');

			//no debit card(s)
			} else {

				//there are credit card(s)
				if(Cards.creditCards > 0){
					Cards.setStatus('no_receive');
				}
			}

		//no cards
		} else {
			Cards.setStatus('no_cards');
		}
	},

	//showing user 'alerts'
	setStatus: function(param){
		$('.alerts').addClass('hidden');

		switch (param) {
			case 'ok':
				$('.alerts').addClass('hidden');
			break;
			case 'no_receive':
				$('.only-credit').removeClass('hidden');
			break;
			case 'no_cards':
				$('.no-cards').removeClass('hidden');
			break;
			default:
		}
	},

	//setting default cards
	setDefaultCard: function(action, cardData){
		if(!action || !cardData) {
			return false;
		}

		PartioLoad.show('Saving default card to ' + action + '...');

		Meteor.call('setDefaultCard', action, cardData, function (err, result){
			PartioLoad.hide();

            if(err) {
                var errorMessage = err.reason || err.message;
                if(err.details) {
                  errorMessage = errorMessage + "\nDetails:\n" + err.details;
                }
                sAlert.error(errorMessage);
                return false;
            }

			Cards.refresh();
		});
	},

	//removing a card
	remove: function(cardData){
		if(!cardData) {
			return false;
		}

		PartioLoad.show('Removing card...');

		Meteor.call('removeCard', cardData, function (err, result){
			PartioLoad.hide();

            if(err) {
                var errorMessage = err.reason || err.message;
                if(err.details) {
                  errorMessage = errorMessage + "\nDetails:\n" + err.details;
                }
                sAlert.error(errorMessage);
                return false;
            }

			Cards.refresh();
		});
	},
}

Template.savedCards.events({
	// 'click #termStripe': function() {
	// 	Meteor.call('updateTerms');
	// },

	'click #addNewCard' : function(e){
		e.preventDefault();

		if(!Meteor.user().profile.birthDate) {
			IonPopup.show({
				title: 'Missing information',
				template: 'Please update your birth date before to add a debit card.',
				buttons:
				[{
					text: 'OK',
					type: 'button-energized',
					onTap: function() {
						IonPopup.close();
						Router.go('/profile');
						return false;
					}
				}]
			});
			return false;
		}

		return true;
	},

	'click .set-pay-default': function(e) {
		var cardData = this;

		if(cardData.defaultPay) {
			return false;
		}

		IonPopup.confirm({
			title: 'Set default card',
			template: 'Do you want set this card as pay default?',
			onCancel: function(){
				return false;
			},
			onOk: function(){
				Cards.setDefaultCard('pay', cardData);
			}
		});
	},

	'click .set-receive-default': function(e) {
		var cardData = this;

		if(cardData.defaultReceive) {
			return false;
		}

		IonPopup.confirm({
			title: 'Set default card',
			template: 'Do you want set this card as receive default?',
			onCancel: function(){
				return false;
			},
			onOk: function(){
				Cards.setDefaultCard('receive', cardData);
			}
		});
	},

	'click .delete-card': function(e){
		var cardData = this;

		if(cardData.defaultReceive || cardData.defaultPay) {
			ShowNotificationMessage('Sorry, you can\'t remove a default card.');
			return false;
		} else {
			IonPopup.confirm({
				title: 'Remove Card',
				template: '<div class="center">Do you want remove this card?</div>',
				onCancel: function(){
					return false;
				},
				onOk: function(){
					Cards.remove(cardData);
				}
			});
		}
	}
});


Template.savedCards.rendered = function(){
	Cards.refresh();
}