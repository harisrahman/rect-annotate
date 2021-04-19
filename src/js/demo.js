//Loading loaded rectangles from url's get string
var loadedRects = deparam(window.location.search.substring(1));
loadedRects = loadedRects ? flatten(loadedRects.coords) : null

new RectAnnotate("img", { load: loadedRects });

//For demo purposes only
function deparam(params)
{
	var digitTest = /^\d+$/,
		keyBreaker = /([^\[\]]+)|(\[\])/g,
		plus = /\+/g,
		paramTest = /([^?#]*)(#.*)?$/;

	if (!params || !paramTest.test(params))
	{
		return {};
	}

	var data = {},
		pairs = params.split('&'),
		current;

	for (var i = 0; i < pairs.length; i++)
	{
		current = data;
		var pair = pairs[i].split('=');

		if (pair.length != 2)
		{
			pair = [pair[0], pair.slice(1).join("=")]
		}

		var key = decodeURIComponent(pair[0].replace(plus, " ")),
			value = decodeURIComponent(pair[1].replace(plus, " ")),
			parts = key.match(keyBreaker);

		for (var j = 0; j < parts.length - 1; j++)
		{
			var part = parts[j];
			if (!current[part])
			{
				current[part] = digitTest.test(parts[j + 1]) || parts[j + 1] == "[]" ? [] : {}
			}
			current = current[part];
		}
		lastPart = parts[parts.length - 1];
		if (lastPart == "[]")
		{
			current.push(value)
		} else
		{
			current[lastPart] = value;
		}
	}

	return data;
}

function flatten(obj)
{
	if (typeof obj != "object") return null;

	return obj.map(element => Object.values(element))
}
