<dbmon>

	<table class="table table-striped latest-data">
		<tbody>
			<tr riot-tag="database" each={ database in databases }/>
		</tbody>
	</table>

	<script>
	this.on('mount', function () {
		console.log(Date.now() - start);
	});
	this.on('update', function() {
		this.loadSamples();
		setTimeout(this.update, ENV.timeout);
	});

	loadSamples() {
		loadCount++;
		var newData = getData();
		var databases = [];

		Object.keys(newData.databases).forEach(function(dbname) {
			var sampleInfo = newData.databases[dbname];

			var samples = [];
			samples.push({
				time: newData.start_at,
				queries: sampleInfo.queries
			});
			if (samples.length > 5) {
				samples.splice(0, samples.length - 5);
			}

			databases.push({
				name: dbname,
				samples: samples
			});
		});

		this.databases = databases;
	}

	</script>

</dbmon>
