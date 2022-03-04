let start () =
  let dir =
    EzAPIServerUtils.empty
    |> EzAPIServerUtils.register Api_services.login Api_handlers.login
  in
  let servers = [ (8030, EzAPIServerUtils.API dir) ] in
  EzAPIServer.server ~geoip:false servers |> Lwt_main.run |> ignore

let () = start ()
