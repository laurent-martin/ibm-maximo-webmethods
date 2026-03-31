// Called when an incident is modified
// Context: ServiceNow Business Rule
// Globals: `gs` : GlideSystem, `sn_ws` : ServiceNow Web Services
// The first argument for `RESTMessageV2` is the RestMessage name.
// The second is the name of the operation
// @param current  modified value
// @param previous value before modification (null when async)
(function executeRule(current, previous) {
    var r = new sn_ws.RESTMessageV2('Call IWHI', 'postWebhook');
    // Set variable values in REST Message with values from current item (incident)
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
