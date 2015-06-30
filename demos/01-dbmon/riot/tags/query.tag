<query>

	<span>{ elapsedFormatted }</span>
	<div class="popover left">
		<div class="popover-content">{ topQuery.query }</div>
		<div class="arrow"></div>
	</div>

	<style>
		[riot-tag=query] {
			position: relative;
		}

		[riot-tag=query]:hover .popover {
			left: -100%;
			width: 100%;
			display: block;
		}
	</style>

	<script>
	this.on('update', function () {
		this.computeFormattedElapsed();
	});

	computeFormattedElapsed() {
		var elapsed = this.topQuery.elapsed;
		var str = parseFloat(elapsed).toFixed(2);
		if (isNaN(str)) {
			return '';
		}
		if (elapsed > 60) {
			var minutes = Math.floor(elapsed / 60);
			var comps = (elapsed % 60).toFixed(2).split('.');
			var seconds = comps[0].lpad('0', 2);
			var ms = comps[1];
			str = minutes + ":" + seconds + "." + ms;
		}
		this.elapsedFormatted = str;
	}
	</script>

</query>
