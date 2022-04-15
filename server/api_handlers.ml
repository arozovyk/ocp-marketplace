open Config
open Utils

let ( >>= ) = Lwt.( >>= )
let unauthorized () = EzAPIServerUtils.return (Error "Error 403")
let not_found s = EzAPIServerUtils.return (Error ("Error 404: " ^ s))
let unknown_error s = EzAPIServerUtils.return (Error ("Error: " ^ s))
let ok e = EzAPIServerUtils.return (Ok e)

let fetch_nfts address =
  Cohttp_lwt_unix.Client.get (Uri.of_string (snowtrace_url address))

let get_collections address =
  fetch_nfts address >>= fun nfts_resp ->
  match nfts_resp with
  | _, resp ->
      resp |> Cohttp_lwt.Body.to_string >>= fun str ->
      let colls =
        Controller.aggregate_transactions address (Yojson.Safe.from_string str)
      in
      Seq.map (fun (k, s) -> (k, S.to_seq s)) (M.to_seq colls) |> Lwt.return

let collections _ _ address =
  get_collections address >>= fun col -> EzAPIServerUtils.return @@ Ok col
