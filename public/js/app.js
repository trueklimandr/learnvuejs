var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
        details: {
            type: Array,
            required: true,
        },
        cart: {
            type: Array,
            required: true,
        },
    },
    template: '<div class="product row">\n' +
        '        <div class="col-md-2">' +
        '          <div class="col-md-12">\n' +
        '            <img class="product-image" v-bind:src="image">\n' +
        '          </div>\n' +
        '          <div class="col-md-12 margin-top">' +
        '          <div>' +
        '            <product-tabs :reviews="reviews"></product-tabs>' +
        '          </div>' +
        '          </div>' +
        '        </div>' +
        '        <div class="product-info">\n' +
        '            <h1 :class="{red: product.onSale}">{{ title }}</h1>\n' +
        '\n' +
        '            <span v-show="product.onSale" class="bright-red">On sale!!!</span>\n' +
        '\n' +
        '            <p v-if="productCount >= 5" class="tip green">In stock</p>\n' +
        '            <p v-else-if="productCount < 5 && productCount > 0" class="tip yellow">Almost sold out</p>\n' +
        '            <p v-else class="tip red">Out of stock</p>\n' +
        '            <p>Shipping: {{ shipping }}</p>' +
        '\n' +
        '            <product-details :details="details"></product-details>' +
        '<br>\n' +
        '\n' +
        '            <div @mouseover="updateProduct(variantIndex)"\n' +
        '                 v-for="(variant, variantIndex) in product.variants"\n' +
        '                 class="inline"\n' +
        '                 :style="{ backgroundColor:variant.color }">\n' +
        '                <span class="font-weight-bold">{{ variant.color }}</span>\n' +
        '            </div>\n' +
        '\n' +
        '            <br><br>\n' +
        '\n' +
        '            <button @click="addToCart" class="btn btn-primary"  :disabled="!productCount>0">Add to Cart</button>\n' +
        '\n' +
        '            <button @click="emptyCart()" class="btn btn-dark">Empty Cart</button>\n' +
        '            <br>' +
        '            <remove-from-cart :cart="cart" @delete-current="deleteCurrent"></remove-from-cart>' +
        '        </div>\n' +
        '    </div>',
    data() {
        return {
            product: {
                selectedVariant: 0,
                brand: "Some brand",
                name: "Some product",
                image: "images/product-default.png",
                onSale: false,
                variants: [
                    {
                        id: 63455,
                        color: "green",
                        image: "images/product-green.png",
                        count: 10,
                    },
                    {
                        id: 63456,
                        color: "red",
                        image: "images/product-red.png",
                        count: 0,
                    },
                    {
                        id: 63457,
                        color: "yellow",
                        image: "images/product-yellow.png",
                        count: 2,
                    },
                ],
            },
            reviews: [],
        };
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.product.variants[this.product.selectedVariant].id);
        },
        updateProduct: function (variantIndex) {
            this.product.selectedVariant = variantIndex;
            this.product.image = this.product.variants[variantIndex].image;
        },
        emptyCart: function () {
            this.$emit('empty-cart');
        },
        deleteCurrent: function (currentRemove) {
            this.$emit('delete-current', currentRemove);
        },
    },
    computed: {
        title() {
            return this.product.brand + " " + this.product.name;
        },
        image() {
            return this.product.variants[this.product.selectedVariant].image;
        },
        productCount() {
            return this.product.variants[this.product.selectedVariant].count;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            }
            return 300.00;
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    },
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true,
        },
    },
    template: '<div class="product-details">' +
        '            <ul>\n' +
        '                <li v-for="detail in details">{{ detail }}</li>\n' +
        '            </ul>\n' +
        '</div>',
});

Vue.component('remove-from-cart', {
    props: {
        cart: {
            type: Array,
            required: true,
        },
    },
    template: '<div class="remove-from-cart" v-show="cart.length">' +
        '            <select class="custom-select-sm" name="cartProductId">' +
        '               <option v-for="cartProductId in cart" ' +
        '                       :value="cartProductId">{{ cartProductId }}</option>' +
        '            </select>\n' +
        '            <button type="button" @click="deleteCurrent">Remove current</button>' +
        '</div>',
    methods: {
        setCurrentRemove: function (event) {
            this.currentRemove = event.srcElement.value;
        },
        deleteCurrent: function (event) {
            this.$emit('delete-current', $(event.srcElement).prev().val());
        },
    },
    data() {
        return {
            currentRemove: 0,
        };
    },
});

Vue.component('product-review', {
    template: '<form class="review-form product-image" @submit.prevent="onSubmit">' +
        '        <p v-if="errors.length">' +
        '          <b>Please correct the following error(s):</b>' +
        '            <ul>' +
        '              <li v-for="error in errors">{{ error }}</li>' +
        '            </ul>' +
        '        </p>' +
        '   <p>' +
        '       <label for="name">Name:</label>' +
        '       <input id="name" v-model="name">' +
        '   </p>' +
        '   <p>' +
        '       <label for="review">Review:</label>' +
        '       <textarea id="review" v-model="review"></textarea>' +
        '   </p>' +
        '   <p>' +
        '       <label for="rating">Rating:</label>' +
        '       <select id="rating" v-model.number="rating">' +
        '           <option>5</option>' +
        '           <option>4</option>' +
        '           <option>3</option>' +
        '           <option>2</option>' +
        '           <option>1</option>' +
        '       </select>' +
        '   </p>' +
        '   <p>' +
        '       <p><b for="recommend">Would you recommend this product?</b></p>' +
        '       <p><input type="radio" v-model="recommend" value="Yes">Yes</p>' +
        '       <p><input type="radio" v-model="recommend" value="No">No</p>' +
        '   </p>' +
        '   <p>' +
        '       <input class="btn btn-success" type="submit" value="Submit">' +
        '   </p>' +
        '</form>',
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        };
    },
    methods: {
        onSubmit() {
            if (this.name && this.rating && this.review) {
                this.errors = [];
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                this.errors = [];
                if (!this.name) this.errors.push("Name required!");
                if (!this.review) this.errors.push("Review required!");
                if (!this.rating) this.errors.push("Rating required!");
            }
        }
    },
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false,
        },
    },
    template: `
        <div>
          <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab">{{ tab }}</span>
          <div v-show="selectedTab === 'Reviews'"> 
            <p v-if="!reviews.length">There are no reviews yet.</p> 
            <ol> 
              <li class="product-image" v-for="review in reviews"> 
                <p>{{ review.name }}</p> 
                <p>Rating: {{ review.rating }}</p> 
                <p>{{ review.review }}</p> 
                <p v-if="review.recommend">Recommend this: <b>{{ review.recommend }}</b></p> 
              </li> 
            </ol> 
          </div>
          <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
      `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
        }
    }
});

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        details: ["Feature one", "Awesome ability", "Legendary reliability"],
        cart: [],
    },
    methods: {
        addToCart: function (id) {
            this.cart.push(id);
        },
        emptyCart: function () {
            this.cart = [];
        },
        deleteCurrent: function (currentRemove) {
            this.cart = this.cart.filter(item => item != currentRemove);
        },
    },
});