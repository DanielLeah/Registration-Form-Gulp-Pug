/*jslint devel: true */

/*eslint no-console: "off", no-undef: "off" */

// IMPLEMENTING THE MODULE PATTERN // 

//Manage Data 
var registrationController = (function(){
    
    var inputAlphabet = function(inputtext) {
        var alphaExp = /^[a-zA-Z]+$/;
        if (inputtext.match(alphaExp)) {
            return true;
        } else {
            return false;
        }
    };

    var emailValidation = function(inputtext) {
       if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputtext))
       {
           return (true)
       }
           return (false)
    };

    var trueSelection = function (inputtext) {
        if (inputtext == "choose") {
            return false;
        } else {
            return true;
        }
    };
    
    //var dataLocal = JSON.parse(localStorage.getItem("formInputs"));
    
    
    return{
        getValidation: function(firstN,lastN,email,gender) {
            return {
                firstNameVal : inputAlphabet(firstN), 
                lastNameVal : inputAlphabet(lastN),
                emailVal : emailValidation(email),
                genderVal : trueSelection(gender)              
            }
        },
        
       /* getData: function(){   why not working?
            return dataLocal;
        }*/
        
  }  
    
    
})();

//Manage UI
var UIController = (function(){
    var DOMStrings = {
        firstname : 'firstname',
        lastname : 'lastname',
        email : 'email',
        gender : 'gender',
        bday : 'bday',
        submitButton : '.btn'
    }; 
    
    var initClasses = function() {
        var icons = document.getElementsByClassName('icon');

        for(var i=0; i< icons.length; i++){
            icons[i].classList.add('hidden');
            icons[i].classList.remove('invalid');
            icons[i].classList.remove('valid');
        }
    }
    
    var updateClasses = function (isVal, key) {
        if (isVal !== true){
            document.querySelector('.'+key).classList.remove('hidden');
            document.querySelector('.'+key).classList.add('invalid');
        }else{
            document.querySelector('.'+key).classList.remove('hidden');
            document.querySelector('.'+key).classList.add('valid');
        }     
    };
    
    var updateData = function (data){
        document.getElementById(DOMStrings.firstname).value = data.firstName;
        document.getElementById(DOMStrings.lastname).value = data.lastName;
        document.getElementById(DOMStrings.email).value = data.email;
        document.getElementById(DOMStrings.gender).value = data.gender;
        document.getElementById(DOMStrings.bday).value = data.bday;
    };
    
    return {
        
        // get the data from inputs
        getInputs : function(){
            return {
                firstName : document.getElementById(DOMStrings.firstname).value,
                lastName : document.getElementById(DOMStrings.lastname).value,
                email : document.getElementById(DOMStrings.email).value,
                gender : document.getElementById(DOMStrings.gender).value,
                bday : document.getElementById(DOMStrings.bday).value
            }
        },
        
        //return the DOMStrings
        getDOMStrings : function(){
            return DOMStrings;
        },
        
        setClasses: function(isVal, key){
            updateClasses(isVal, key);  
        },
        
        initClasses: function(){
            initClasses();
        },
        
        updateData: function(data){
            updateData(data);
        }
    }
})();

// Global App Controller

var controller = (function(regisCtrl, UICtrl){
     
    var formInputs;
    var setupEventListeners = function() {

        
        var DOMStr = UICtrl.getDOMStrings();
        
        document.querySelector(DOMStr.submitButton).addEventListener('click', saveRegistration);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                saveRegistration();
            }
        });
    }
    
    var saveRegistration = function() {
        var input, valResult, isValid;
        input = UICtrl.getInputs();
        UICtrl.initClasses();
        if (input.firstname !== "" && input.lastname !== "" ){
            valResult = regisCtrl.getValidation(input.firstName, input.lastName, input.email, input.gender);
        }
        isValid = true;
        Object.keys(valResult).forEach(function(key){
            UICtrl.setClasses(valResult[key], key);  
            if (valResult[key] === false){
                isValid = false;
            }
        });
        if (isValid){
            localStorage.setItem("formInputs",JSON.stringify(input));
            console.log("if valid");
            formInputs = JSON.parse(localStorage.getItem("formInputs"));
            //document.getElementById("inputs").innerHTML = JSON.stringify(JSON.parse(localStorage.getItem("formInputs")));
            clearInputs();
            setTimeout(function(){
                UICtrl.updateData(formInputs);
             },1500);

            
        }else{
            console.log('not saved');
        }
        
    };
    
    function clearInputs(){
        
        
        document.getElementById("firstname").value = "";
        document.getElementById("lastname").value = "";
        document.getElementById("email").value = "";
        document.getElementById("gender").value = "choose";
        document.getElementById("bday").value = "";
        UICtrl.initClasses(); 
    }
    
   /* function clearLocal(){
        localStorage.clear();
    }*/
    
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.initClasses();
            setupEventListeners();
        },
        
        clearLocalInputs: function(){
            clearInputs();
        }
    };
    
})(registrationController, UIController);
var templateHTML = templates["testing-data"]({
    message: JSON.stringify(JSON.parse(localStorage.getItem("formInputs")))
});
document.write(templateHTML);
controller.init();
