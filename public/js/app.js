var product = {
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
    template: '<div class="product">\n' +
        '        <div class="product-image">\n' +
        '            <img v-bind:src="image">\n' +
        '        </div>\n' +
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
};

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

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        details: ["Feature one", "Awesome ability", "Legendary reliability"],
        cart: [],
    },
    components: {
        'product': product,
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