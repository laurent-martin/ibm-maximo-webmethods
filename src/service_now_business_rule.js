// Called when an incident is modified
// Context: ServiceNow Business Rule
// Globals: `gs` : GlideSystem, `sn_ws` : ServiceNow Web Services
// The first argument for `RESTMessageV2` is the RestMessage name.
// The second is the name of the operation
// @param current  modified value
// @param previous value before modification (null when async)
(function executeRule(current, previous) {
    // Get REST Message created earlier in ServiceNow
    var r = new sn_ws.RESTMessageV2('Call IWHI', 'postWebhook');
    // Set variable in REST Message with values from current item (incident)
    r.setStringParameterNoEscape('resume_callback', current.correlation_display);
    // Convert current record to JSON
    var body = {};
    var fields = current.getFields();
    for (var i = 0; i < fields.size(); i++) {
        var field = fields.get(i);
        body[field.getName()] = current.getValue(field.getName());
    }
    // Set as request body
    r.setRequestBody(JSON.stringify(body));
    try {
        var response = r.execute();
        var responseBody = response.getBody();
        var status = response.getStatusCode();
        gs.info("Webhook sent. Status: " + status);
    } catch (ex) {
        gs.error("Webhook failed: " + ex.message);
    }
})(current, previous);
