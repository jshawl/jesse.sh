---
title: Recursive React Forms
---

I was recently working on a [SOAP](https://en.wikipedia.org/wiki/SOAP) client user interface and needed the ability
to nest inputs to an arbitrary depth and edit the data inline.

## Demo

Given an object of unknown depth: 

```json
{
  "age": 33,
  "name": {
    "first": "Jesse",
    "last": "Shawl"
  },
  "interest": {
    "javascript": {
      "for": "sure"
    }
  }
}
```

Display a form that visually matches the data structure and allows users to edit the data.

<p class="codepen" data-height="666" data-theme-id="light" data-default-tab="result" data-slug-hash="mdKoaXP" data-user="jshawl" style="height: 666px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/jshawl/pen/mdKoaXP">
  Recursive React Form</a> by Jesse Shawl (<a href="https://codepen.io/jshawl">@jshawl</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### Why Use Recursion?

I probably could have assumed that any data structures would not be more than 3 or so
levels deep and kept track of the level, but I was curious about handling an infinitely deep
data structure.

### How does it work?

I started out with the simple case:

```json
{
  age: 33
}
```

and focused on a simple component to manage state changes:

```js
function TableForm({data}){
  return (
    <table>
      <thead>
        <tr>
          <td>key</td>
          <td>value</td>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data).map(key => {
          return <tr>
            <td>{key}</td>
            <td>{data[key]}</td>
          </tr>
        })}
      </tbody>
    </table>
  )
}
```

Making the data structure a little more complex will error out, because `data[key]` is an object
and React doesn't allow objects as children. Enter the recursive case.

```js
function TableForm({data}){
  return (
    <table>
      <thead>
        <tr>
          <td>key</td>
          <td>value</td>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data).map(key => {
          return <tr>
            <td>{key}</td>
            <td>{
              typeof data[key] === "object" ? 
                <TableForm data={data[key]} /> : {data[key]}
            }</td>
          </tr>
        })}
      </tbody>
    </table>
  )
}
```

This will render the nested tables no problem. Things became complicated when I tried to handle change events recursively. Let's dig in.

## Recursive Change Handlers

I decided to manage state all the way up at the `<App />` level, which told me I'd need to
pass an `onChange` prop to `TableForm`.

We also need some inputs. Here's an abbreviated set of components:

```js
function TableForm({data, onChange}){
  // ...
  {
    typeof data[key] === "object" ? 
    <TableForm data={data[key]} onChange={onChange}/> :
    <input value={data[key]} onChange={onChange}/>
  }
  // ...
}

function App(){
  return (
    <TableForm onChange={d => console.log('updated data is:', d)}>
  )
}
```

This will work great for the single level data structure. e.g. modify the `age` input and the object that comes out of the top level `onChange` will be `{age: 33}`.

The problem is that editing children objects will bubble all the way up to the top level `onChange`.

e.g. given an object like:

```json
{
  name: {
    first: "Jesse",
    last: "Shawl"
  }
}
```

`onChange` will only ever send back `{first: "Jesse"}` or `{last: "Shawl"}`.

I wanted to make sure the entire data structure came back out, so:

```js
function TableForm({data, onChange}){
  // ...
  {
    typeof data[key] === "object" ? 
    <TableForm data={data[key]} onChange={d => onChange(...data, [key]: d)}/> :
    <input value={data[key]} onChange={e => onChange(...data, {[key]: e.target.value})}/>
  }
  // ...
}
```

Now editing the `first` input will trigger the top level `onChange` to send back the entire object:

```json
{
  name: {
    first: "Jesse",
    last: "Shawl"
  }
}
```

Pretty cool! You can scroll up to play around with the demo or fork it on [codepen](https://codepen.io/jshawl/pen/mdKoaXP). 

I'm super tempted to make a slick Soap client UI now that I have the basic code to edit its data structure. We'll see what comes of it.
