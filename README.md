# anonymfile API
#### Connect to Anonym File in a very simple way, to be able to upload your files quickly and efficiently. Node.js


### Example

```javascript
import AnonymousFiles from 'anonymfile';

const dir = './HelloWorld.txt';

(async() => {
	const result = await AnonymousFiles({directory: dir});
	console.log(result);
})();
```

#### If you need to upload multiple files at once, try this...

```javascript
import AnonymousFiles from 'anonymfile';

(async() => {
	const result = await AnonymousFiles({
		directory: ['./Hello.txt', './World.md']
	});

	console.log(result);
})();
```

### Also you can see the progress using a callback

```js
import AnonymousFiles from 'anonymfile';

(async() => {
	const result = await anonymfile({
		directory: './Hello.txt',
		
		progress: (progress) => {
			console.log(progress);
		}
	});

	console.log(result);
})();
````

#### However, you also want to compress the files just indicate it, as you will see below

```javascript
import AnonymousFiles from 'anonymfile';

(async() => {
	const result = await AnonymousFiles({
		directory: ['./Hello.txt', './World.md'],
		compress: {
			active: true,
			name: 'Hello_World',
			type: 'zip' // 'zip' or 'tar'
		}
	});

	console.log(result);
})();
```