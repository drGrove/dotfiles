var ASLLocalizer = {
	// Localize all sub-elements, or the entire page if none are provided
	localize: function localize($element) {
		$element = $element || $(document);
		var self = this;
    
		$element.find('[data-l10n]').each(function(idx, element) {
			self.localizeElement($(element));
		});
	}
	,localizeElement: function localizeElement($element) {
		var messageKey = $element.attr('data-l10n');
		if (messageKey) {
			var rawArgs = $element.attr('data-l10n-args');
			var messageArgs;
			if (rawArgs) {
				messageArgs = JSON.parse(rawArgs);
			}
			$element.html(chrome.i18n.getMessage(messageKey, messageArgs));
		}
	}
};
