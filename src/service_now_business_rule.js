(function executeRule(current, previous /*null when async*/) {
    var r = new sn_ws.RESTMessageV2('Call IWHI', 'postWebhook');
    // Optional: override values dynamically
    r.setStringParameterNoEscape('number', current.number);
    r.setStringParameterNoEscape('short_description', current.short_description);
    r.setStringParameterNoEscape('correlation_id', current.correlation_id);
    r.setStringParameterNoEscape('execution_id', current.correlation_id);
    // Convert current record to JSON
    var obj = {};
    var fields = current.getFields();
    for (var i = 0; i < fields.size(); i++) {
        var field = fields.get(i);
        obj[field.getName()] = current.getValue(field.getName());
    }
    // Set as request body
    r.setRequestBody(JSON.stringify(obj));
    try {
        var response = r.execute();
        var responseBody = response.getBody();
        var status = response.getStatusCode();
        gs.info("Webhook sent. Status: " + status);
    } catch (ex) {
        gs.error("Webhook failed: " + ex.message);
    }
})(current, previous);
