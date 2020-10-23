# Mixins in Enigma.js

Getting started:
```sh
git clone https://github.com/coolinmc6/enigma-mixins-tutorial.git
cd enigma-mixins-tutorial
npm i
npm run dev
```
- Update the `config` directory with the configuration for your app
- The `<MyChart />` component is an example, you can get rid of it.

# Blog Post: Introduction to Enigma.js Mixins

We've discussed Engima.js on this blog before https://community.qlik.com/t5/Labels-page/bd-p/Category_Labels?categoryId=qlik-design-blog&corenode=boards&labelText=enigma.js&nodetype=boards but it is usually within the context of building a mashup (Enigma is also the library that the Qlik Demo Team uses for https://github.com/qlik-demo-team/qdt-components). https://github.com/qlik-oss/enigma.js/ is a library that helps you communicate with the Qlik QIX Engine. One cool feature about Enigma.js is that it allows you to write your own mixins to extend or override the methods on the Qlik objects that you use all the time. This post will teach you the basics of mixins and show you how to implement your own.

## Your First Mixin

Here is the finished repo if you want to see the final product [https://github.com/coolinmc6/enigma-mixins-tutorial](https://github.com/coolinmc6/enigma-mixins-tutorial). If you want to follow along, clone the repo and checkout the "start" branch `git checkout -b start` to follow along from the beginning.

Hopefully you are familiar with the typical Enigma configuration (https://community.qlik.com/t5/Qlik-Design-Blog/Qlik-Engine-and-Picasso-js/ba-p/1706241)
because that's where mixins must be included. For this first mixin and the others that we'll write, we'll create a separate mixin file just to keep the code clean. We'll be mostly working in that mixin file and `index.js`.

First, create a separate file in your `/config` directory called `mixins.js`. Copy the code below and we'll get started:

```js
// mixins.js
const docMixin = {
  types: ['Doc'],
  init(args) {},
  extend: {
    myMixin() {
        console.log('myMixin was called - this is all it does');
    },
  }
}

export {
  docMixin,
};

```
Add your mixin to the config file `app.js`:
```js
// app.js
import { docMixin } from './mixins';

// CODE

export default enigma.create({ 
  schema, url, mixins: [docMixin] // add docMixin
}).open().then(global => global.openDoc(config.appId));
```

Now, in your index.js file, simply call your mixin by doing: `app.myMixin()`. If you check your console, you'll see the console.log message we entered; you've just completed your first mixin!

I want to quickly summarize the mixin object before we move on (here are the [docs](https://github.com/qlik-oss/enigma.js/blob/master/docs/api.md#mixins)). Mixin objects should have a types property to indicate which Qlik Objects (e.g. Doc, GenericObject, GenericBookmark, etc.) you are modifying. For this first mixin, we'll be modifying the Doc class. Next is the `init(args)` method which runs some code when you initialize your mixin. Lastly there are two properties: "extend" and "override". As their names suggest, "extend" will add methods to the Qlik Object while "override" will overwrite the existing Qlik Object methods. This tutorial will mainly focus on extending the functionality of Qlik Objects.

## Using Qlik Objects in Mixins

Now that we've created our first mixin with a single method that extends our Doc object, let's step it up and write a method to get hypercube data. The point of this method is to do all that Qlik QIX Engine stuff for us.

We know that we want this method to be on the Doc class so in our code, we can just write the method below our `myMixin()` code like so:

```js
// mixins.js
const docMixin = {
  types: ['Doc'],
  init(args) {},
  extend: {
    myMixin() {
        console.log('myMixin was called - this is all it does');
    },
    mGetData({ object }) {
      return new Promise((res) => {
        this.createSessionObject(object).then((obj) => {
          console.log(obj)
          obj.getLayout().then((layout) => {
            const data = layout.qHyperCube.qDataPages;
            res(data);
          })
        })
      })
    },
  }
}

export {
  docMixin,
};
```
In our index.js file, we'll call the method and provide a hypercube. We've used this hypercube before on this blog (it simply shows the sales margin by product category from our Consumer Sales app). Copy the hypercube and code below to call the method:

```js
// index.js
const hypercube = {
  qInfo: { qId: 'Sales by Year', qType: 'data'},
  qHyperCubeDef: {
    qDimensions: [
      // { qDef: { qFieldDefs: ['[Country]']} },
      { qDef: { qFieldDefs: ['[Product Group Desc]']} }
    ],
    qMeasures: [
      { qDef: { qDef: 'SUM([Sales Margin Amount])'}, },
    ],
    qInitialDataFetch: [{
      qTop: 0, qLeft: 0, qWidth: 10, qHeight: 1000,
    }],
    qInterColumnSortOrder: [],
    qSuppressZero: true,
    qSuppressMissing: true,
  }
}

// CODE

(async () => {
  const app = await appPromise;
  app.myMixin()
  const data = await app.mGetData({ object: hypercube })
  console.log(data)
})()
```
In the console, you'll notice two more logs there. The first is the session object that we just created (and that you're probably all too familiar with). The second is the data that we've requested in a JavaScript array. It's still in the Qlik formatting and may require more clean-up if you wanted to look at just the data but notice how easy it now is to request data for any hypercubes that you may write. We can now avoid having to write all that code over and over and just use our new `mGetData()` method.

## Using Other Mixin Methods

Another cool feature of these methods is that we can use other methods that we've written. For this method, we're going to use our `mGetData()` method to just log a table of the data in the console.

Let's add the code to our mixins file right below `mGetData()`:

```js
// CODE
mPrintTable({ object }) {
  return new Promise((res) => {
    this.mGetData({ object }).then((qObj) => {
      const table = []
      qObj[0].qMatrix.map((o) => {
        const row = {}
        o.map((c,i) => {
          let val = c.qNum === "NaN" ? c.qText : c.qNum
          row[`c${i}`] = val;
        })
        table.push(row);
      })
      console.table(table);
      res(table);
    })
  })
},
```
And call it in our index.js file:
```js
// CODE

const table = await app.mPrintTable({ object: hypercube })
console.log(table);

// CODE
```
Now take a look at your console. You'll see that we have printed a table!

To quickly summarize what's going on here, we now have three methods on the doc class: `myMixin()`, `mGetData()`, and `mPrintTable()`. We can call ALL of them within each other using the "this" object because it is the "doc" object; they are the same. All of these methods have extended the functionality of the Doc class so ALL of them are available whenever you use `app` or, within these methods, the `this` object. In the next section, we are going to create a separate mixin for just Generic Objects so you can see this concept in action.

## Generic Object Mixin

First, add the code below to our mixins file:

```js
// mixins.js

// docMixin CODE

const objectMixin = {
  types: ['GenericObject'],
  init(args) {},
  extend: {
    objectMixin(msg) {
      console.log('layout mixin', msg)
      this.getLayout().then((layout) => {
        console.log("Layout: ", layout)
      })
    }
  },
}

export {
  docMixin, objectMixin
};
```
Notice that the the "types" property says "GenericObject" and NOT "Doc". This method will ONLY be available for Generic Objects. (Don't forget to export our objectMixin at the bottom of the mixins.js file).

```js
// app.js
import { docMixin, objectMixin } from './mixins'; // import the objectMixin

// CODE

export default enigma.create({ 
  schema, url, mixins: [docMixin, objectMixin] // add it to our mixins array
}).open().then(global => global.openDoc(config.appId));
```
Now in our index.js file, do the following:

```js
app.createSessionObject(hypercube).then((obj) => {
  console.log(obj)
  obj.objectMixin('hey there')
  obj.myMixin()
})
```
As you can see here, we used our Doc object to call `createSessionObject()` to manually create an instance of the Generic Object class. You'll see in the console that there are a few more logs. First, you'll see the Generic Object that you've probably seen many times. Next, you'll see the message "layout mixin hey there" from our `objectMixin()` method as well as the layout object. Last, and this was just to illustrate the point, when we called `myMixin()` on our Generic Object, it didn't work - we got an error. This happens because the `myMixin()` method is ONLY on the Doc class. Just like `objectMixin()` is ONLY on the Generic Object class. Keep this in mind when you are writing your own methods as you'll most likely need different behaviors for the different Qlik Objects.

## Additional Mixins for Same Type

Now let's create a second Generic Object mixin.

```js
const objectMixin2 = {
  types: ['GenericObject'],
  init(args) {},
  extend: {
    objectMixin2() {
      console.log('layout mixin #2')
      this.getLayout().then((layout) => {
        console.log("Layout #2: ", layout)
      })
    }
  },
}

export {
  docMixin, objectMixin, objectMixin2
};
```
Update your config:
```js
import { docMixin, objectMixin, objectMixin2 } from './mixins';

export default enigma.create({ 
  schema, url, mixins: [docMixin, objectMixin, objectMixin2]
}).open().then(global => global.openDoc(config.appId));
```
And then call it in index.js:
```js
app.createSessionObject(hypercube).then((obj) => {
  console.log(obj)
  obj.objectMixin2('hey there')
})
```
And there we go. We've just created a second mixin for our Generic Object class. Now why is this important? It allows you to organize your code into blocks that make sense to YOU and not feel constrained by keeping the "types" together. You may have methods that you want available across ALL types and then methods for only one class. In that case, you'd need separate mixins. One important caveat to remember is that you cannot have name clashes within the same type. So if we called our method "objectMixin()` inside our second object mixin, we'd get an error because the method name clashes with the method name from our first object mixin.

## Bring it All Together

The last little bit of code we'll write reinforces what we did above with with the `mPrintTable()` method. But instead of doing two Doc class methods, we'll call our new `objectMixin()` method within our `mGetData()` method. Here we go:

```js
// mixins.js
mGetData({ object }) {
  return new Promise((res) => {
    this.createSessionObject(object).then((obj) => {
      console.log(obj)
      obj.objectMixin('from inside mGetData') // NEW CODE
      obj.getLayout().then((layout) => {
        const data = layout.qHyperCube.qDataPages;
        res(data);
      })
    })
  })
},
```
Now take a look in your console (clean-up or comment out some of our older code if you have trouble seeing the log). You'll see the "from inside mGetData" message. This is the power of mixins. You simply pick the Qlik Object type you'd like to modify or extend (Doc, Generic Object, etc.) and write your code. Now you can call your custom method directly on those objects as if they were native to that object. It gives developers a great deal of flexibility and the ability to write code that can be used in multiple projects.

## Conclusion

Let's wrap things up by reviewing what we did here in this blog:

1. Overview of mixins and their purpose
2. Method #1: `myMixin()` - how to call a method from your mixin
3. Method #2: `mGetData()` - using Enigma.js methods from your mixin
4. Method #3: `mPrintTable()` - calling your own custom methods
5. Method #4: `objectMixin()` - creating and calling a method from your Generic Object mixin
6. Method #5: `objectMixin2()` - creating a second Generic Object method
7. Using code from your other mixins

For more information on mixins, please take a look at these links below:

- [Enigma.js Mixin Documentation](https://github.com/qlik-oss/enigma.js/blob/master/docs/api.md#mixins)
- [Enigma.js Mixin Examples](https://github.com/qlik-oss/enigma.js/blob/master/examples/README.md#mixins)