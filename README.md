# CluedIn Sidecar
## What is it?

CluedIn Sidecar is an example of an alternative UI client for CluedIn.

CluedIn is a robust MDM platform that provides powerful APIs: REST and GraphQL.

By its nature, API is more versatile than UI. With the API, you can do everything that you can do in UI and even more.

We can consider the CluedIn web interface as an official, but not the only possible UI client to CluedIn API. And while it covers most of the everyday use cases, it is still possible to implement yet another client that can provide custom user interfaces that satisfy specific customers' needs.

If you work with Kubernetes, you can consider it as Lens for CluedIn. In the same way, as Lens is one of many possible UIs on top of Kubernetes API, CluedIn Sidecar is the UI for CluedIn API. 

On the technical level, Sidecar is a serverless Angular application. By serverless, we mean that this app is nothing more than a bunch of static HTML, JavaScript, and CSS files you can host in your local folder, in a public blob container, or on GitHub Pages (for example: [https://romaklimenko.github.io/cluedin/](https://romaklimenko.github.io/cluedin/)).

It stores access tokens in your browser's localStorage, which means that there is no central app server that keeps all credentials - they are in your browser only.

As Lens, CluedIn Sidecar supports multiple contexts - you need to create an access token to connect to a new CluedIn instance.

After creating a token in CluedIn, go to Sidecar and press `N` or click "Add a token". Then, paste the token's value, give it a good name, and save – you will see it in the list of tokens:

![Tokens](https://storage.googleapis.com/dirty-public/tokens.png)

To select a current token, press the corresponding digit on your keyboard or click on it in the list.

### Hotkeys

* `H` - go to the home page.
* `V` - (token page) go to vocabulary.
* `E` - (token page) edit token settings.
* `1-9` - (when on the tokens list page) go to the corresponding token.

### UI

Vocabulary:

![Vocabulary](https://storage.googleapis.com/dirty-public/vocabulary.png)

Search:

![Search](https://storage.googleapis.com/dirty-public/search.png)

Entity:

![Entity](https://storage.googleapis.com/dirty-public/entity.png)

References navigation:

![Reference navigation](https://media.giphy.com/media/ZHFcT84EqgFbA94dVz/giphy.gif)


Graph navigation:

![Graph navigation](https://media.giphy.com/media/BVP12HhIrIytSEB5dK/giphy.gif)