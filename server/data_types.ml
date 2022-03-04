type event = string
type title = string
type timeline = { events : event list; title : title option }
type collections = (title * title Seq.t) Seq.t
