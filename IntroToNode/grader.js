function average(grades) {
	var total = 0;
	grades.forEach(function(grade) {
		total += grade;
	});
	return Math.round(total / grades.length);
}

var scores = [90,98,89,100,100,86,94];
console.log(average(scores));

scores = [40,65,77,82,80,54,73,63,95,49];
console.log(average(scores));
