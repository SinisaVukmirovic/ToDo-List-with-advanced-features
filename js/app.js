(function() {

    //  getting the elements
    const itemForm = document.getElementById('itemForm');
    const itemInput = document.getElementById('itemInput');
    const itemList = document.querySelector('.item-list');
    const clearBtn = document.getElementById('clear-list');
    const feedback = document.querySelector('.feedback');

    //  initializing an empty array which will later store data in local storage
    // let itemData = [];

    //  first checking local storage to see if something is stored
    //  and if its empty setting the value to []
    let itemData = JSON.parse(localStorage.getItem('list')) || [];

    //  if there is something in the local storage...
    if (itemData.length > 0) {
        itemData.forEach(singleItem => {
            //  using itemList because its the parent element of items in list
            //  adding items from local storage to the end of the list, with beforeend
            itemList.insertAdjacentHTML('beforeend', `<div class="item my-3">
                <h5 class="item-name text-capitalize">${singleItem}</h5>
                <div class="item-icons">
                    <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
                    <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
                    <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
                </div>
            </div>`);

            //  handle function for handleing the icn functionality
            //  must be called with singleItem parameter passed 
            //  for the icon buttons loaded from local storage to work
            handleItem(singleItem);
        });
    }

    //  event listener, listening for a submit event
    itemForm.addEventListener('submit', function(e) {
        //  preventing the default behaviour of form submit
        e.preventDefault();

        //  getting the value in the form
        const textValue = itemInput.value;

        //  checking if nothing is passed in the form...
        if (textValue === '') {
            //  ...showing the alert message
            showFeedback('Please enter valid value...', 'danger');
        }
        else {
            //  add item
            addItem(textValue);

            //  clearing the input form
            itemInput.value = '';

            //  adding the item to the array
            itemData.push(textValue);

            //  adding items to the local storage
            //  first parapm is how we name item in storage,
            //  second is turning an arr into a string with JSON
            localStorage.setItem('list', JSON.stringify(itemData));

            //  adding event listeners to icons which don't exist at start,
            //  just after we add an item to the list
            handleItem(textValue);

        }
    });

    //  creating the function for show feedback
    function showFeedback(text, action) {
        //  adding 2 new classes to the feedback element
        feedback.classList.add('showItem', `alert-${action}`);
        feedback.innerHTML = `<p>${text}</p>`;

        //  removing the alert after 3 secnds
        setTimeout(() => {
            feedback.classList.remove('showItem', `alert-${action}`);
        }, 3000);
    }

    //  function for adding items
    function addItem(value) {
        //  creating a div element for the added item
        const div = document.createElement('div');
        div.classList.add('item', 'my-3');

        div.innerHTML = `
            <h5 class="item-name text-capitalize">${value}</h5>
            <div class="item-icons">
                <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
                <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
                <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
            </div>
        `;

        //  appending the div / item to the list
        itemList.appendChild(div);
    }

    //  function for handling icons events
    function handleItem(textValue) {
        const items = itemList.querySelectorAll('.item');
        //  looping through the items
        items.forEach(item => {
            //  before adding the event listeners 
            // we check if this is the last item we added to the list
            if (item.querySelector('.item-name').textContent === textValue) {
                
                //  event listener for complete icon
                item.querySelector('.complete-item').addEventListener('click', function() {
                    //  first add toggle and visibility functionality of the icon
                    item.querySelector('.item-name').classList.toggle('completed');

                    //  to change the visibility of icon
                    this.classList.toggle('visibility');
                });

                //  event listener for edit icon
                item.querySelector('.edit-item').addEventListener('click', function() {
                    //  storing whaever was inputed in the input form
                    itemInput.value = textValue;
                    //  when editing we remove the item from the list with filter() and
                    //  add it back into the input field for editing
                    itemList.removeChild(item);
                    itemData = itemData.filter(function(item) {
                        return item !== textValue;
                    });

                    //  updating the edit in the local storage
                    localStorage.setItem('list', JSON.stringify(itemData));
                });

                //  event listener for removing
                item.querySelector('.delete-item').addEventListener('click', function() {

                    itemList.removeChild(item);
                    itemData = itemData.filter(function(item) {
                        return item !== textValue;
                    });

                    //  updating the removing of item in the local storage
                    localStorage.setItem('list', JSON.stringify(itemData));

                    //  showing alert message for deletion of item
                    showFeedback('Item Deleted', 'success');
                });
            }
        });
    }

    //  clear button functionality for deleting everything from the list
    clearBtn.addEventListener('click', function() {

        itemData = [];  //  don't really get why this is needed!!!

        //  removing the list from local storage after clear button
        localStorage.removeItem('list');

        //  checking to see if there are items in the list
        const items = itemList.querySelectorAll('.item');
        if (items.length > 0) {
            items.forEach(item => {
                itemList.removeChild(item);
            });
        }
    });

})();