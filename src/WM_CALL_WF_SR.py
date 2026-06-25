# `mbo`: Maximo Business Object, here it is the service request object
# `service` : See https://www.ibm.com/docs/en/masv-and-l/maximo-manage/cd?topic=concepts-service-object
# `ENDPOINT_NAME`: Define as script variable
from com.ibm.json.java import JSONObject
from java.util import HashMap
from java.lang import Throwable

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Fields to include in json payload
FIELDS = ["TICKETID", "DESCRIPTION", "REPORTEDBY"]


def log(level, msg):
    """
    Use service.log which adapts to the debug level.
    """
    if True:
        service.log("[%s] %s" % (service.getScriptName(), msg))
    elif level == "DEBUG":
        service.log_debug(msg)
    elif level == "INFO":
        service.log_info(msg)
    elif level == "WARN":
        service.log_warn(msg)
    elif level == "ERROR":
        service.log_error(msg)


# ---------------------------------------------------------------------------
# Guard: only process brand-new Service Request records
# ---------------------------------------------------------------------------
if not mbo.isNew():
    log("DEBUG", "mbo is not new: skipping.")
else:
    try:
        # ------------------------------------------------------------------
        # 1. Extract field values from the SR mbo
        # ------------------------------------------------------------------
        fields = {f: (mbo.getString(f) or "") for f in FIELDS}
        log("INFO", "Starting: SR: %s" % fields["TICKETID"])
        # Should not happen:
        if not fields["TICKETID"]:
            raise Exception("TICKETID is empty: cannot invoke endpoint.")
        # ------------------------------------------------------------------
        # 2. Build JSON payload
        # ------------------------------------------------------------------
        json_obj = JSONObject()
        for k, v in fields.items():
            json_obj.put(k, v)
        json_payload = json_obj.serialize(True)
        log("DEBUG", "Payload: %s" % json_payload)
        # ------------------------------------------------------------------
        # 3. Invoke the outbound HTTP End Point via MIF
        # ------------------------------------------------------------------
        log("DEBUG", "Invoking endpoint: %s" % ENDPOINT_NAME)
        response = service.invokeEndpoint(
            ENDPOINT_NAME, HashMap(), json_payload)
        log("DEBUG", "Endpoint '%s' invoked successfully. Response: %s"
            % (ENDPOINT_NAME, response))
    except Throwable as e:
        log("ERROR", "Error invoking endpoint '%s': %s"
                     % (ENDPOINT_NAME, str(e)))
        raise
