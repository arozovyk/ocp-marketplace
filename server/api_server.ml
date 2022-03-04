let start () =
  let dir =
    EzAPIServerUtils.empty
    |> EzAPIServerUtils.register Api_services.collections Api_handlers.collections
  in
  let servers = [ (8030, EzAPIServerUtils.API dir) ] in
  EzAPIServer.server ~geoip:false servers |> Lwt_main.run |> ignore

let () = start ()
