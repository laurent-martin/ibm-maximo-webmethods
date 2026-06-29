# Check if the record being processed by the channel is a new creation
if not mbo.isNew():
    # Stop the publish channel from queuing this record
    evalresult = False
