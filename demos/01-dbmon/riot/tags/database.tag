<database>
	<td class="dbname">{ database.name }</td>
	<td class="query-count">
		<span class={ countClassName }>{ topFiveQueries.length }
	</td>
	<td riot-tag="query" each={ topQuery in topFiveQueries }></td>

	<script>
	this.on('update', function () {
		this.computeTopFive();
	});

	computeTopFive() {
		var lastSample = this.database.samples[this.database.samples.length - 1];
		var topFiveQueries = lastSample.queries.slice(0, 5);
		while (topFiveQueries.length < 5) {
			topFiveQueries.push({ query: "" });
		}

		var countClassName = "label";
		if (lastSample.queries.length >= 20) {
			countClassName += " label-important";
		}
		else if (lastSample.queries.length >= 10) {
			countClassName += " label-warning";
		}
		else {
			countClassName += " label-success";
		}

		this.topFiveQueries = topFiveQueries;
		this.countClassName = countClassName;
	}
	</script>

</database>
