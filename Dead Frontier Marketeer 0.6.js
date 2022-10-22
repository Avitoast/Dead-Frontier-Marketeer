// ==UserScript==
// @name         Dead Frontier Marketeer
// @namespace    http://tampermonkey.net/
// @version      0.6202
// @description  QoL features for the Dead Frontier Market. Currently it displays the price per bullet for ammunition.
// @author       bogidot
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @icon         https://i.imgur.com/5lJ3Jb1.png
// @license      MIT License
// ==/UserScript==

(function() {
    'use strict';

    console.log('DFM: Marketeer is here');

    setTimeout(() => {

        console.log("DFM: Starting Marketeer");

        function is_buy_tab () {
            const buyingTab = document.getElementById('loadBuying');
            if (buyingTab.disabled) {
                return true;
            } else {
                return false;
            }
        }

        function get_prices () {
            itemObserver.disconnect()
            keyCheck = true;

            const itemDisplay = document.getElementById('itemDisplay');
            if (itemDisplay.childNodes.length <= 0) {
                console.log("no items found");
                return
            }

            var items = document.querySelectorAll(".fakeItem");
            var price = document.querySelectorAll(".salePrice");

            var i = 0;
            items.forEach ((item) => {

                //if (item.dataset.quantity > 1 || typeof item.dataset.quantity != 'string') {
                    var pricePer = item.dataset.price / item.dataset.quantity;

                    pricePer = Math.round((pricePer + Number.EPSILON) * 100) / 100;

                    var add = '';
                    if (price.item(i).innerHTML.length + pricePer.toString().length >= 12){
                        add = "<br>";
                        item.style.paddingBottom = '0.75rem';
                    }

                    price.item(i).innerHTML += `${add}<span style="background: -webkit-linear-gradient(#eee, #333);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;">($${pricePer})</span>`;
                    i++;
                //}
            })
        }

        function check_for_items () {
            const itemDisplay = document.getElementById('itemDisplay');

            if (itemDisplay.childNodes.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        function observe_market (target = itemDisplay) {
            const itemDisplay = document.getElementById('itemDisplay');
            itemObserver.observe(target, observerOptions);
        }

        const itemObserver = new MutationObserver(get_prices);
        const observerOptions = {
            childList: true,
            subtree: true
        }

        search_field_listener();

        var keyCheck = true;
        const marketplace = document.getElementById('invController');
        marketplace.addEventListener("click", (e) => {

            if (is_buy_tab()) {
                search_field_listener()
            }

            if (e.target.dataset.page == "buy" && check_for_items()) {
                get_prices()
            }

            if (e.target.id == "makeSearch") {
                observe_market();
            }

            if (e.target.dataset.action == "buyItem") {
                const popup = document.getElementById('gamecontent')
                popup.addEventListener("click", (e) => {
                    if (e.target.innerHTML == "Yes") {
                        observe_market();
                    } else if (e.target.innerHTML == "No") {
                        popup.removeEventListener()
                    }
                })
            }                
        })

        function search_field_listener () {
            const searchField = document.getElementById('searchField')
            searchField.addEventListener("keydown", (e) => {
                if (e.key == "Enter" && keyCheck) {
                    keyCheck = false;
                    observe_market();
                }
            })
        }   

    }, 1000)


})();