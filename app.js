// Storage controller
const StorageController = (function() {

  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in LS
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        // push new item
        items.push(item);
        // Reset LS
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    getItemsFromStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items))
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if(id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items))
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();


// Item controller
const ItemController = (function() {
  // item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data structure / State
  const data = {
    items: StorageController.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public method
  return {
    getItem: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0
      }

      // Calories to number
      calories = parseInt(calories);
      // Create new item
      newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemByID: function(id) {
      let found = null;
      // loop through items
      data.items.forEach(item => {
        if(item.id === id) {
          found = item;
        }
      });

      return found
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);
      
      let found = null;

      data.items.forEach(item => {
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get IDs
      ids = data.items.map(item => {
        return item.id;
      });
      const index = ids.indexOf(id)

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    }, 
    getTotalCalories: function() {
      let total = 0;
      // Loop through items and add cals
      data.items.forEach(item => {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;
      // return totals
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  }
})();

// UI controller
const UIController = (function() {
  const UISelectors = {
    itemList: '#item-list',
    itemsList: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  }
  
  // Public method
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(item => {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong><em>${item.calories} calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name:  document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.classList.add('collection-item');
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `;

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.itemsList);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';

    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemController.getCurrentItem().calories;
      UIController.showEditState();
    },
    removeItems: function() {
      let listitems = document.querySelectorAll(UISelectors.itemsList);

      // Trun Node list into Array
      listitems = Array.from(listitems);
      listitems.forEach(item => {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    clearEditState: function() {
      UIController.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },
    getSelectors: function() {
      return UISelectors;
    }
  }
})();

// APP controller
const AppController = (function(ItemController, StorageController, UIController) {
  // Load event listeners
  const loadEventListeners = function() {
    // Generate selectors from UI Controller
    const UISelectors = UIController.getSelectors();
    // Add item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', e => {
      if(e.key === 'Enter'){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.clearEditState);

    // Clear all
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Add item submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UIController.getItemInput();

    // Check for name and calories value
    if(input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemController.addItem(input.name, input.calories);
      // Add item to UI list
      UIController.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemController.getTotalCalories();
      // Add total calories to UI
      UIController.showTotalCalories(totalCalories);
      // Storage to LS
      StorageController.storeItem(newItem);
      // Clear fields
      UIController.clearInput();
    }
    e.preventDefault();
  }

  // Update item submit
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // Get list item id (item 0, item 1)
      const listID = e.target.parentNode.parentNode.id;
      // Breake into an array
      const listIDArray = listID.split('-');
      // Get actual id
      const id = parseInt(listIDArray[1]);
      // Get item
      const itemToEdit = ItemController.getItemByID(id);
      // Set current item
      ItemController.setCurrentItem(itemToEdit);
      // Add item to form
      UIController.addItemToForm();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UIController.getItemInput();
    // Update item
    const updatedItem = ItemController.updateItem(input.name, input.calories);

    // Update UI
    UIController.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);

    // Update LS
    StorageController.updateItemStorage(updatedItem);

    UIController.clearEditState();

    e.preventDefault();
  }

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemController.getCurrentItem();

    // Delete from data structure
    ItemController.deleteItem(currentItem.id);

    // Delete form UI
    UIController.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);

    // Delete from LS
    StorageController.deleteItemFromStorage(currentItem.id);

    UIController.clearEditState();

    e.preventDefault();
  }

  // Clear all item event
  const clearAllItemsClick = function() {
    // Delete all items from data sctructure
    ItemController.clearAllItems();
    // Get total calories
    const totalCalories = ItemController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);

    UIController.clearEditState();
    // Remove from UI
    UIController.removeItems();

    // Clear from LS
    StorageController.clearItemsFromStorage();

    // Hide UL
    UIController.hideList();
  }

  // Public method
  return {
    init: function() {
      // Clear edit state / set initial state
      UIController.clearEditState();
      // Fetch items from data structure
      const items = ItemController.getItem();

      // Check if any items
      if(items.length === 0) {
        UIController.hideList();
      } else {
        // Populate list with items
        UIController.populateItemList(items);
      }

       // Get total calories
       const totalCalories = ItemController.getTotalCalories();
       // Add total calories to UI
       UIController.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemController, StorageController, UIController);

// Initialize APP
AppController.init();