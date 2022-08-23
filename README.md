### Example

```javascript
import AnonymousFiles from 'anonymfile';

const dir = './HelloWorld.txt';

(async() => {
	const result = await AnonymousFiles({directory: dir});
	console.log(result['url']);
})();
```