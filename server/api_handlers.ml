 
let unauthorized () = EzAPIServerUtils.return (Error "Error 403")
let not_found s = EzAPIServerUtils.return (Error ("Error 404: " ^ s))
let unknown_error s = EzAPIServerUtils.return (Error ("Error: " ^ s))
let ok e = EzAPIServerUtils.return (Ok e)

let login _ _ (email, pwdhash) =
  let _ = (email, pwdhash) in

  EzAPIServerUtils.return
  @@ Ok Data_types.{ title = Some "title1"; events = [ "event1"; "event2" ] }
