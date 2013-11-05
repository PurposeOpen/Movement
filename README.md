'Movement' is a movement template site that works with the **[Purpose Platform](https://github.com/PurposeOpen/Platform)**.

It uses the **[Porpoise](https://github.com/PurposeOpen/Porpoise)** gem, which provides the API binding to the Platform as well as controllers, models, views, and assets that can be over-ridden in the movement site.

### Try it!

Try a demo of the Purpose Platform and a movement site running on it here:

[https://platform-dev-demo.herokuapp.com](https://platform-dev-demo.herokuapp.com)  
login: `admin@example.com`  
password: `developers3x`

[https://movement-dev-demo.herokuapp.com](http://movement-dev-demo.herokuapp.com)

These apps may need a minute to warm up on your first request because they are running on Heroku's free tier.

### Getting Started

Run the Purpose Platform locally. Instructions are [here](https://github.com/PurposeOpen/Platform/wiki/Running-the-Purpose-Platform-Locally-on-Mac-OS-X).

Fork this repository (PurposeOpen/Movement), clone locally and navigate to the 'Movement' folder that was created, and set the following environment variables (assuming you created a movement on the Platform named 'Demo Movement'):

**MOVEMENT_ID**=demo-movement  
**MOVEMENT_NAME**='Demo Movement'  
**PLATFORM_BASE_URI**=http://localhost:5000/api/  
**ENABLE_ACTIVITY_FEED**=true

If you want to try out the PayPal donation feature, create a sandbox account at [developer.paypal.com](https://developer.paypal.com/), and set the following environment variables:

**PAYPAL_501C3_API_LOGIN**  
**PAYPAL_501C3_API_PASSWORD**  
**PAYPAL_501C3_API_SIGNATURE**  
**PAYPAL_501C4_API_LOGIN**  
**PAYPAL_501C4_API_PASSWORD**  
**PAYPAL_501C4_API_SIGNATURE**

_501C3 and 501C4 are two types of non-profit organizations in the US that have different tax requirements. When creating a donation page in the Purpose Platform, you can select whether the donation goes toward 501C3 or 501C4 activity. The environment variables above allow you to specify an account that will receive each type of donation._

Detailed environment variable documentation is available [here](https://github.com/PurposeOpen/Platform/wiki/Environment-Variables).

To start the movement site run:  
`rails s`

### Running in Production

Modify public/robots.txt to allow spiders to crawl your site. It currently bans all spiders.

Donations are set to run in test mode in all environments by default (in config/initializers/active_merchant.rb). To accept real donations, after setting the PayPal environment variables with non-sandbox PayPal credentials, set the following in your production environment:  
`ActiveMerchant::Billing::Base.mode = :production`

The **SECRET_TOKEN** environment variable is required when running in production. See config/initializers/secret_token.rb. A new token can be created by running:  
`rake secret`

### Community
- [Developer discussions](http://groups.google.com/group/purpose-platform-dev)
- [General discussions](http://groups.google.com/group/purpose-platform-general)

### [License](https://github.com/PurposeOpen/Movement/wiki/License)
- This project is released under the [MIT license](https://github.com/PurposeOpen/Movement/wiki/License).

### Image Attribution
- app/assets/images/masthead_background.jpg:
[Protest](http://www.flickr.com/photos/zoonabar/7221714496/) by Chris Brown
[CC BY-SA 2.0](http://creativecommons.org/licenses/by-sa/2.0/)