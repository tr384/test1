let app = new Vue ({
    el: '#app',
    data:{
        lessons: [],
        sitename:'e-learning Store',
        onHome: true,
        // showlesson: true,
        url: "http://localhost:3000",
        //canAddToCart:true,
        search:"",
        cart:[],
        order: {
          name: "",
          phone:"",
      },
        checkoutForm: {
          name: {
            value: "",
            error: "",
          },
          phone: {
            value: "",
            error: "",
          },
        },
      },

    // fetching the lessons in json from the get path
    created: function () {
        fetch("http://localhost:3000/collections/lessons")
          .then((response) => response.json())
          .then((lessons) => {
            this.lessons = lessons;
            return;
          });
        this.getLessons();
        return;
      },
      
      watch: {
        search: {
            handler() {
                this.getLessons();
            },
            deep: true,
        },
    },

methods: {    
    getLessons() {
        const url = `${this.url}/?search=${this.search}`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((lessons) => {
            this.lessons = lessons;
          })
          .catch((Error) => {
            console.log("Error");
          });
      },

      createNewOrder(order) {
        fetch("http://localhost:3000/collections/orders", {
          method: "POST", //set the HTTP method as "POST"
          headers: {
            "Content-Type": "application/json", //set the data type as JSON
          },
          body: JSON.stringify(order), //need to stringigy the JSON
        }).then(function (response) {
          response.json().then(function (json) {
            // alert("Success: " + json.acknowledged);
            console.log("Success: " + json.acknowledged);
            // webstore.products.push(order);
          });
        });
      },
     
       async updateLesson({ lesson, space }) {
        try {
          const url = `${this.url}/lessons/${lesson.id}`;
  
          fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              space: space,
            }),
          });
        } catch (error) {
          this.error = error;
        }
      }, 


       updateLessonSpaces(type, id) {
        switch (type) {
          case "decrease":
            this.lessons = this.lessons.map((lesson) => {
              if (lesson.id === id && lesson.space > 0)
                return { ...lesson, space: lesson.space-- };
  
              return lesson;
            });
            break;
  
          case "increase":
            this.lessons = this.lessons.map((lesson) => {
              if (lesson.id === id && lesson.space > 0)
                return { ...lesson, space: lesson.space++ };
  
              return lesson;
            });
            break;
  
          default:
            break;
        }
      },
 
      changePage() {
        this.onHome = !this.onHome;
      },
       

    submitForm(){                         //Form Submission At Checkout, Alert Prompt
         alert('Order Has Been Submitted')

    },   

    addToCart (lesson) {            
       let cartItem = this.GetCartItem(lesson);

       if(cartItem != null){                            //if the cart item is null then add 1 to quantity else add the lesson to the cart
        cartItem.quantity++;
        } else {
            this.cart.push({
                lesson: lesson,
                quantity:1
            })
        }
        lesson.space--;
    },

    


    cartCount(lesson) {               //counts how many items are added to the cart, and adds to the cart 
        let count = 0;
        for(let i = 0; i < this.cart.length; i++) {
            if(this.cart[i] === lesson) {
                count++;
            }
        }
        return count;
    },
    canAddToCart(lesson) {        //allows the product to be added to cart if there are lessons availble
        //  return lesson.space > this.cartCount(lesson.id);
        return lesson.space > 0;

    },
    
     showCheckout() {                   //shows the check out when toogled
        // this.showlesson = this.showlesson? false: true;
        this.onHome = this.onHome? false: true;
    }, 

    GetCartItem(lesson){          //Gets the item in cart By id
        for (i= 0; i < this.cart.length; i++) {
            if(this.cart[i].lesson === lesson) {
                return this.cart[i]
            }
        }
    },


    removeItem(item) {
        item.quantity = item.quantity -1;
        item.lesson.space = item.lesson.space -1;
        if (item.quantity ==0) {
            let itemIndex = this.cart.indexOf(item); //this line gets the posistion of the item in the cart array
            this.cart.splice(itemIndex, 1); // removes the item at the index position in the cart array splice removes the item at the given position, item index is by one
        }
    },

    checkout() {
      this.cart.forEach(async (lesson) => {
        this.createNewOrder({
          name: this.checkoutForm.name.value,
          phone: this.checkoutForm.phone.value,
          id: lesson.id,
          space: lesson.space,
        });

        this.updateLesson({
          id: lesson._id,
          space: lesson.space,
        });
      });

      this.changePage();

      this.cart = [];
    },
    

    

          
        
    }, 
computed:{
   

     /* lessonSearch () {
        tempLessons = this.lesson;

        if (this.search != '' && this.search) {
            tempLessons = tempLessons.filter((result) => {
                return result.subject.toUpperCase().includes(this.search.toUpperCase()) ||
                result.location.toUpperCase().includes(this.search.toUpperCase())
            })
        
        }
        return tempLessons
        },  */

       
        enableSubmit: function(){                        //checks phone and name for regular expressions
            let isnum = /^\d+$/.test(this.order.phone);
            let isletter = /^[A-Za-z]+$/.test(this.order.name);
            return isnum == true && isletter == true
        },

         totalItems: function() {                           //returns the number of items in cart
            return this.cart.length;
        }, 

      

        enableCheckout: function(){                        //Enables the checkout when cart has more than 0 items
            return this.cart.length > 0;
        },
        cartItemCount: function () {
            if (this.cart.length > 0)
              return this.cart.reduce((total, item) => total + item.space, 0);
            return 0;
          },
        },
        watch: {
          searchText: {
            handler(val) {
              this.getLessons();
            },
          },
        },
      });





        