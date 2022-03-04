open Config
open Utils

let ( >>= ) = Lwt.( >>= )
let unauthorized () = EzAPIServerUtils.return (Error "Error 403")
let not_found s = EzAPIServerUtils.return (Error ("Error 404: " ^ s))
let unknown_error s = EzAPIServerUtils.return (Error ("Error: " ^ s))
let ok e = EzAPIServerUtils.return (Ok e)
let fetch_nfts () = Cohttp_lwt_unix.Client.get (Uri.of_string snowtrace_url)

let f2 address =
  fetch_nfts () >>= fun nfts_resp ->
  match nfts_resp with
  | _, resp ->
      resp |> Cohttp_lwt.Body.to_string >>= fun str ->
      let colls =
        Controller.aggregate_transactions address (Yojson.Safe.from_string str)
      in
      Seq.map (fun (k, s) -> (k, S.to_seq s)) (M.to_seq colls) |> Lwt.return

let collections _ _ address =
  let _ = address in
  f2 address >>= fun col -> EzAPIServerUtils.return @@ Ok col
