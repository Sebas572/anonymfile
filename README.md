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
	const result = await anonymfile({
		directory: ['./Hello.txt', './World.md']
	});

	console.log(result);
})();
```

#### However, you also want to compress the files just indicate it, as you will see below

```javascript
import AnonymousFiles from 'anonymfile';

(async() => {
	const result = await anonymfile({
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