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

## Licensing

In order to use the Creative Developer Tools you need a valid license.

You can request a limited time trial license free of charge by using the License Manager to order 'CRDT_Demo'.

Furthermore, small and medium sized developer businesses can be provided with free licenses - all you need to do is ask.

For larger companies, there is a license fee of US$29/seat.

## How it works

This works by way of a daemon. Launching the daemon will start an HTTPS server on https://localhost.tgrg.net

This address resolves to 127.0.0.1

To start the daemon, you can run the _License Manager_, go into the preferences, and tick the checkbox _Launch daemon for Creative Developer Tools when License Manager starts_. 

This will automatically start the daemon each time you run the _License Manager_. The daemon will continue running after you quit _License Manager_, until the next restart of your computer.

Alternatively, run the double-clickable scripts `startDaemon.command` (Mac) or `startDaemon.bat` (Windows).

Once the daemon is running, you can call the entry points in the module 'cdtuxp.js' from your UXP Plugin or UXPScript.

You can also terminate the daemon with the scripts `killDaemon.command` (Mac) or `killDaemon.bat` (Windows).

## How to activate

The _License Manager_ is provided in the _Helpers_ subfolder. 

You can leave the _License Manager_ where it is, below the _Helpers_ folder. You can also find and move the License Manager folder for your platform from the _Helpers_ folder to some convenient location (e.g. `/Applications` or `C:\Program Files`).

The install process is simple: move the License Manager folder to its desired location and then manually launch the _License Manager_ app at least once after you shifted it to a different location.

Create a standard account in the _License Manager_ by clicking the _New_ button bottom right of the _Accounts_ window.

Enter a descriptive name and a valid email address, and choose an unlock code. You need to enter the unlock code twice.

Click OK. Once the account has been created, make sure to _Register_ the account. 

You will receive a confirmation email with a confirmation link. If the email does not arrive, make sure to check your email spam filter!

Note: there is a checkbox _Save Unlock Code_. 

If you're on a secure personal computer, you might want to save the unlock code to avoid having to re-enter it each time you launch the _License Manager_. 

If you don't save the unlock code, you will need to re-enter it each time you restart the _License Manager_.

Note: you can create as many accounts as needed.

It is allowed to re-use the same email address for multiple accounts, as long as they have a different unlock code.

If you _do_ re-use the same email address for more than one account, make sure to use different unlock codes, and good descriptive names, so you can tell the accounts apart.

For example, you might have one account that you use for your own personal use, and one or more additional accounts that you could use for ordering embeddable _Creative Developer Tools_ activations for your customers or colleagues.

Always make sure your account is unlocked. If you did not save your unlock code, you might need to re-enter the code.

Now we need to add the product information for the software to be activated into the _License Manager_. 

Use the _Store_ window in the _License Manager_, and browse into the _Catalog of Rorohiko Licensed Products_.

Click the entry for either `Creative Developer Tools 2024` or `Creative Developer Tools Demo`. 

This will open the _Order a License_ window in the _License Manager_.

If you have multiple accounts available, pick the correct one from the popup menu. Enter the number of seats needed, and type in an order reference that has relevance to you. Then click the _Save_ button. 

This creates a _License Request_ file (`.lirq` file name extension).

Attach this file to an email to mailto:sales@rorohiko.com. 

Make sure to mention any additional details that might be relevant or useful in your email (e.g. let us know if you prefer us to send you a PayPal invoice).

No payment is needed for `CRDT_Demo`.

If your company (or the final end-user) is not a small or medium-size business, payment of US$29/seat is required for `CRDT_2024`.

Payment processing for `CRDT_2024` is not currently automated - you need to manually send payment using PayPal, to `sales@rorohiko.com`. 

With your payment, make sure to mention the same order reference that you used in the _License Manager_, so we can match your payment to the order info embedded in the _License Request_.
```
    https://www.paypal.com
```       

Once we have received the required payment, we will email you an activation file for the order, which will have a `.capb` file name extension. 

Again, make sure to check your email spam filter!

Open this `.capb` file with _License Manager_. The _License Manager_ will match this activation file to the outstanding order. 

In the _Licenses, Activations and Pending Orders_ window you can now select the order and click the _Activate_ button to activate your workstation.

You can now start using _Creative Developer Tools_

## Sublicensing/auto-activation

You might want to embed _Creative Developer Tools_ into your own commercial script or plug-in, or have _Creative Developer Tools_ auto-activate so the end-user does not have to handle any activations.

To achieve this, you can embed an activation into your source code.

First, obtain a license for _Creative Developer Tools_ as documented in the previous section. 

You might want to create a separate standard account just for this, to keep it all separate from any other licenses and activations you might have.

Once the order is fullfilled, don't activate the license. Instead, you will be 'passing on' the license to your customers or colleagues.

In addition to your standard account, which you've used to order the _Creative Developer Tools_ activation, you now also need a separate developer account.

Switch the _License Manager_ to 'Developer/Publisher' mode via the _File - License Manager Mode_ menu.

If you don't have a developer account yet, create and register one. Wait for a confirmation email, and make sure to check your spam filter. 

Once you have a developer account, go to the _Sublicensing_ window, and select the order.

Change the popup menu to _JavaScript_, then click the _Copy_ button. 

Switch to your editor with your source code, and _Paste_ right after the line in your source code where you load _Creative Developer Tools_:
```
const cdtuxp = require("./cdtuxp");
```
so it looks like
```
const cdtuxp = require("./cdtuxp");

cdtuxp.setIssuer("1186cb861234567377c49d7eade","my@email.com");
cdtuxp.sublicense("hdjshsajdshajdkas..lotsofit...NEmgd0UGH28dbI1RK0GRig==");

```

The software will now auto-activate when your customer runs your UXP script or plug-in and the user won't have to deal with activations.

`cdtuxp.sublicense()` returns a boolean - it will return `false` if the activation fails for some reason, so you can verify in code whether the activation succeeded or not.

## Changing computers

When you need to activate on another computer you can re-use the same licensing info - the activation can be transferred over. 

If you activated by way of the _License Manager_: you can export and import all your account and activation data between computers. Use the _File - Export License Info..._ and _File - Import License Info..._ menu items to move the licensing info between computers by way of a transfer file.

If you activated by way of the sublicensing mechanism, then the actvation will transport automatically. 

There is a limitation on how frequently you can re-activate: after you activate a seat on a particular computer, you need to wait at least 10 minutes before you can re-activate the same seat on another computer.
