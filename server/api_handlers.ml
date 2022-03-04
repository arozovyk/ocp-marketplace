open Config
open Utils

let unauthorized () = EzAPIServerUtils.return (Error "Error 403")
let not_found s = EzAPIServerUtils.return (Error ("Error 404: " ^ s))
let unknown_error s = EzAPIServerUtils.return (Error ("Error: " ^ s))
let ok e = EzAPIServerUtils.return (Ok e)

let fetch_nfts () =
  Cohttp_lwt_unix.Client.get (Uri.of_string snowtrace_url) |> Lwt_main.run

let f2 =
  match fetch_nfts () with
  | _, resp ->
      let str = Cohttp_lwt.Body.to_string resp |> Lwt_main.run in
      let colls =
        Controller.aggregate_transactions
          "0xE27AbB5392c3163798ce5e0B52dc927F318F825D"
          (Yojson.Safe.from_string str)
      in
      Seq.map (fun (k, s) -> (k, S.to_seq s)) (M.to_seq colls)

let login _ _ (email, pwdhash) =
  let _ = (email, pwdhash) in
  let col : Data_types.collections = f2 in
  EzAPIServerUtils.return @@ Ok col
