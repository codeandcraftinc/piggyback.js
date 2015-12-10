[![Build Status](https://api.travis-ci.org/codeandcraftnyc/wayne.js.svg?branch=master)](https://travis-ci.org/codeandcraftnyc/wayne.js)

# wayne.js

Sometimes you have a function, and sometimes that function takes a while to
execute. Sometimes other functions invoke that function while it's already
executing, making it execute again and again. Maybe that even happens a few
more times. But in this arbitrary example, all of those functions that called
the original function (the one that takes a while), they just want the same
thing.

What if we just used the result from the first invocation for everything?



## Huh? (The Problem)

You need to make a call. A call to an API somewhere. So you make a function,
`myRequest`, to handle that API call. Let's say you've even added a caching
mechanism since that call may take _seconds_ to complete -- the next time you
make the same call it'll finish a lot faster.

> Warning: pseudo-code below, hopefully it's clear enough

```js
function myRequest(params) {
  let key = `myRequest:${hashMyParams(params)}`

  return cache.get(key).then((cached) => {
    if (cached) {
      return cached
    }

    return apiClient.get(params.url).then((res) => {
      return cache.set(key, res)
    })
  })
}
```

That's great! It'll store the result for next time. I'm feeling good.
But suddenly...

```js
// this happens somewhere
myRequest({
  url: '/a-fun-url-with-fun-data'
}).then(...)

// immediately afterwards, this happens somewhere else
myRequest({
  url: '/a-fun-url-with-fun-data'
}).then(...)
```

That's the same request. Twice. Maybe even thrice. And they're happening in
such short succession that there's no chance to cache the result from the
first invocation and use it for the second. Hrmph. We end up hitting the API
multiple times and waiting forever for both responses. So now what?



## Cool! (The Solution)

Let's update `myRequest` with `wayne`.

```js
function myRequest(params) {
  let key = `myRequest:${hashMyParams(params)}`

  return wayne(key, () => {
    return cache.get(key).then((cached) => {
      if (cached) {
        return cached
      }

      return apiClient.get(params.url).then((res) => {
        return cache.set(key, res)
      })
    })
  })
}
```

Now any duplicate request that happens in quick succession of the original
will "piggyback" on the original's result, the API call and caching only
happens once.



## License

The MIT License (MIT)

Copyright (c) 2015 Code & Craft, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
