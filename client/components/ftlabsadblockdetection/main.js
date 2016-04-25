const detection = require('AdBlockDetection');
const adBlockEvent = new Event('adsblocked');

function handleBlock(){
	
	console.log("Dispatch event...");
	
	document.body.dispatchEvent(adBlockEvent);
	
}

module.exports = {
	init : function(){
		
		console.log("Ad Block Detection initialised");
		
		detection.init({
			complete : function(areBlocked){
				
				console.log("Tests are complete. Are there ad-blockers enabled?", areBlocked);
				
				if (areBlocked) {
					handleBlock();
				}

			}
		});
		
	}
}