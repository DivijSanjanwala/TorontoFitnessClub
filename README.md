# TorontoFitnessClub

Design of models 

Accounts:
We are using JWT to manage authentication. Thus the login is handled automatically and the user is returned a token to access the server.  

We are using the default User module to store the username, password, email, 

Avatar:
Avatar essentially acts as the custom user model
		User: Foriegn Key to the Default User Model
		Avatar : Stores the Image of the User
Card: 
		User: Foriegn Key to the Default User Model
		Name: Name of the card 
		Number: Card Number 

Studios:

For the studios we have three models to incorporate the studio details, the details of the amenities,  and for the set of images
Studios : 
Fields: Name, Address, Longitude, Latitude, Postal Code, Phone  
            Number, and User Distance. 
Studio Images:

Each studio stores a set of images, we have included this in our design by creating another model which stores an image along with the studio as the Foreign Key.

Fields: 
Studio -  Foreign Key to Studios
Image -  Image corresponding to the studio

Studio Amenities:
Stores the studio amenities, which can be edited as the website admin
	Studio - Foreign Key to Studios
	Type - The type of amenity
	Quantity - The quantity of the amenity


Classes:
In order to implement the class methods, we are using three models, Class, ClassInstance,  UserEnrolled. The classInstance model helps us implement recurring classes.  The UsersEnrolled model helps us store the enrolled students in a class.

Class:
studio = Foreign Key to Studios
name = Name of the Class
description = Class Description
coach = Name of the coach for the class
capacity = Maximum number of students allowed
start_time =  Start Time of the Class
    	end_time = End of the class
    	period = Duration between two classes
    	keywords = Keywords associated with the class

ClassInstance:
Fields: 
	ClassObj: Foreign Key to Class
	Time: Time of the class
	CurrentCapacity: Stores the current capacity of the class
	
UsersEnrolled:
Fields: 
	User - ForeignKey to the Default user model
	ClassInstance - ForeignKey to the User


Subscriptions:

Subscription: This enables creating a link between the Studio and the Subscription Plan model. A User creates a link ie: a subscription with the Studio through this model

		Studio: Foreign Key to the Studio to which the Subscription is made
		User: Foreign Key to the Default User Model
		Plan: Foreign Key to the Subscription Plan
		Start Date: Start Date of the Subscription
		End Date: End Date of the Subscription
		Payment Date: Date when the payment for the subscription was made
		Card Name: Card Used to make the subscription
		Card Number:  Card Number of the card used to make the subscription
	
2. SubscriptionPlan: These are the plans available for selection for the users. Users select from these available subscription options. 

    name =  Name of the Subscription
    price = Price of the subscription 
    duration = Duration of the subscription
    description = Description of the subscription plan
    subscription_type = Type of the subscription 

Important Note:
While using Postman,  please set the access token as the environment variable “token”. This will enable authentication since we mentioned {{token}} as our Bearer Token for authentication
