open Config
open Utils

let fetch_nfts () =
  Cohttp_lwt_unix.Client.get (Uri.of_string snowtrace_url) |> Lwt_main.run

let f () =
  match fetch_nfts () with
  | _, resp -> (
      let str = Cohttp_lwt.Body.to_string resp |> Lwt_main.run in
      match Yojson.Safe.from_string str with
      | `Assoc [ _; ("message", `String "OK"); ("result", transaction_list) ] ->
          Format.printf "%a" Yojson.Safe.pp transaction_list
      | _ -> Format.eprintf "Error calling snowtrace")

let f2 () =
  match fetch_nfts () with
  | _, resp ->
      let str = Cohttp_lwt.Body.to_string resp |> Lwt_main.run in
      let colls =
        Controller.aggregate_transactions
          "0xE27AbB5392c3163798ce5e0B52dc927F318F825D"
          (Yojson.Safe.from_string str)
      in
      M.to_seq colls
      |> Seq.iter (fun (s, a) ->
             Format.printf "Collection for %s of size %d\n  " s (S.cardinal a);
             S.iter (fun x -> Format.printf "Item %s" x) a)

let start () =
  let dir =
    EzAPIServerUtils.empty
    |> EzAPIServerUtils.register Api_services.login Api_handlers.login
  in
  let servers = [ (8030, EzAPIServerUtils.API dir) ] in
  EzAPIServer.server ~geoip:false servers |> Lwt_main.run |> ignore

let _ = f2 ()
