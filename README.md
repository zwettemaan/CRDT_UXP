# Creative Developer Tools for UXP

## What it does

Creative Developer Tools is a growing suite of tools aimed at script and plug-in developers for the Adobe Creative Cloud eco-system.

Currently, it is at an alpha stage: the feature set is not frozen, and new features are added regularly.

The first release, 0.0.1 is functional and stable, and useful.

Features include:

- Add licensing and activation features to your script
- Provides a unique machineGUID for each end-user computer
- Provides a unique account GUID for each end user
- Read/Write files beyond the UXP sandbox, including binary files
- AES-256 encryption/decryption functions
- Base64 encode and decode functions

## How it works

This works by way of a daemon. Launching the daemon will start an HTTPS server on https://localhost.tgrg.net

This address resolves to 127.0.0.1

To start the daemon, you can run the _License Manager_. Go into the Preferences, and tick the checkbox _Launch daemon for Creative Developer Tools when License Manager starts_. 

This will automatically start the daemon each time you run the _License Manager_. The daemon will continue running after you quit _License Manager_, until the next restart of your computer.

Alternatively, run the double-clickable scripts `startDaemon.command` (Mac) or `startDaemon.bat` (Windows).

Once the daemon is running, you can call the entry points in the module 'crdtuxp.js' from your UXP Plugin or UXPScript.

You can also terminate the daemon with the scripts `killDaemon.command` (Mac) or `killDaemon.bat` (Windows).

Both on Mac and Windows, the built-in security systems might balk and bring up scary warnings. On Mac, you can run `macDequarantineHelpers.command`. On Windows, you have to click through the warnings and run the `.bat` files despite the complaints.

You can configure these scripts as startup items and make the daemon auto-start after a computer restart.

## Licensing and Trialling

In order to try out or use the Creative Developer Tools you need a valid license.

You can request a limited time trial license free of charge by way of the _License Manager_ (see below), and put in an order for 'CRDT_Demo'.

Small and medium sized developer businesses are entitled to free licenses - all you need to do is ask.

For larger companies, there is a license fee of US$29/seat. 

## Installing License Manager

### Mac 

If desired, move the `LicenseManager` application file to its desired location. 

Double-click the `LicenseManager` application icon to run the app from its current location at least once. 

### Windows

If desired, move the `LicenseManager` folder for your version of Windows to its desired location.

Navigate into the `LicenseManager` folder and double-click the `LicenseManager.exe` icon to run the app from its new location at least once. 

## Activating

### Standard Account

You need a Standard Account to activate the software.

Start the _License Manager_.

Create a standard account by clicking the _New_ button, bottom right of the _Accounts_ window.

Enter a descriptive name and a valid email address, and choose an unlock code. You need to enter the same unlock code twice.

Click _OK_. 

After the account has been created, click _Register_ to register the account. 

You will receive a confirmation email with a confirmation link. 

If the email does not arrive, make sure to check your email spam filter!

### Save Unlock Code

On the _Accounts_ window, there is a checkbox _Save Unlock Code_.

If you're on a secure personal computer, you might want to select your account, then save the unlock code, to avoid having to re-enter the code each time you launch the _License Manager_. 

If you don't save the unlock code, you will need to re-enter the code each time you restart the _License Manager_.

### Multiple Accounts

You can create as many accounts as needed.

It is allowed to re-use the same email address and unlock code for multiple accounts.

If you _do_ re-use the same email address for more than one account, make sure to use good descriptive names, so you can tell the accounts apart.

For example, you might use one account that you keep for your own personal use, and one or more additional accounts that you could use for ordering embeddable _JSXGetURL_ activations to pass on to your customers or colleagues.

Always make sure your account is unlocked. If you did not save your unlock code, you will need to re-enter the code if the account is locked.

### Fetch Product Info

Now we need to add the product information for the software to be activated into the _License Manager_. 

Use the _Store_ window in the _License Manager_, and browse into the _Rorohiko_ Catalog.

Click one of the entries for `Creative Developer Tools` to open the _Order a License_ window in the _License Manager_.

### Create an Order

Enter the number of seats needed. 

Type in some order reference that will have relevance to you. 

Finally, if you have multiple accounts available, you will now need to select the correct account from the popup menu. 

Then click the _Save_ button. 

This creates a _License Request_ file (`.lirq` file name extension).

### Send us your order

Attach this `.lirq` file to an email to mailto:sales@rorohiko.com. 

In your email, make sure to mention any additional details that might be relevant or useful in your email (e.g. let us know if you prefer us to send you a PayPal invoice).

### Payment

If you need to pay a license fee, payment processing is not yet automated - you need to manually send payment of US$29/seat using PayPal, to `sales@rorohiko.com`. 

With your payment, make sure to mention the order reference that you also used in the _License Manager_, so we can match your payment to the order info embedded in the _License Request_.
```
    https://www.paypal.com
```       

### Activation File

Once we have received your payment, we will email you an activation file for the order, which will have a `.capb` file name extension. Again, make sure to check your email spam filter!

Start the _License Manager_ and go to the _Licenses, Activations and Pending Orders_ window. 

Click _Import_ and import the `.capb` file. 

The _License Manager_ will match this activation file to the outstanding order. 

### Activate

In the _Licenses, Activations and Pending Orders_ window you can now select the order entry and click the _Activate_ button to activate your workstation.

## Sublicensing/auto-activation

You might want to bundle _Creative Developer Tools_ with your own commercial software, or have _Creative Developer Tools_ auto-activate so the end-user does not have to handle any activations. 

To achieve this, you can add your activation info as a side-car file.

In addition to your standard account (incoming), you also need a separate developer account (outgoing).

The incoming order will be placed using a standard account, and the outgoing sublicense will be tied to a developer account.

First, switch the _License Manager_ to _Standard_ mode via the _File - License Manager Mode_ menu. Purchase a license for _Creative Developer Tools_ as documented in the previous section. 

Once the order is validated and the activation file has been imported, switch the _License Manager_ to _Developer/Publisher_ mode.

If you don't have a developer account yet, create and register one. Wait for a confirmation email, and make sure to check your spam filter. 

Once you have a registered developer account, go to the _Sublicensing_ window, and select the order.

Select the option _SideCar File_, then click the _Copy_ button. Start your text editor and create a new file, and _Paste_ the activation info (JSON format). Save this file with a `.actv` file name extension (e.g. `MyAutoActivation.actv`).

On your end-users computer, you need to copy this file into the folder `%APPDATA%\net.tightener\Licensing\AutoActivations` or `~/Library/Application Support/net.tightener/Licensing/AutoActivations`.

The software will now auto-activate when your customer runs it and the user won't have to deal with activations.

## Changing computers

When you need to activate on another computer you can transfer and re-use the same licensing info. Activations can be transferred over. 

If you activate your copy of _JSXGetURL_ by way of the _License Manager_: you can export and import all your account and activation data between computers. Use the _File - Export License Info..._ and _File - Import License Info..._ to manage a transfer.

If you activate your copy by way of the sublicensing mechanism, then the actvation will transport automatically. 

Note that to avoid abuse, there is a limitation on how frequently you can re-activate: after you activate a seat on a particular computer, you need to wait at least 10 minutes before you can re-activate the same seat on another computer.

