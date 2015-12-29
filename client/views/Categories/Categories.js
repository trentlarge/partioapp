Template.categoriesBox.events({
	'click .category': function(e, template) {
    var categoryText = $(e.currentTarget).find('span').text();
    var categoryIndex = Categories.getCategoryIndexByText(categoryText);
    Session.set('categoryIndex', categoryIndex);
    Session.set('searchText', '');
		Router.go('/listing');
	},
});

Template.categoriesBox.helpers({
    getCategory: function(index) {
        return Categories.getCategory(index);
    },
    getCategoryIcon: function(index) {
        return Categories.getCategoryIcon(index);
    }
});
