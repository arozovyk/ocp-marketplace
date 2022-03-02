open Config
 
let fetch_nfts () =
  Cohttp_lwt_unix.Client.get (Uri.of_string snowtrace_url) |> Lwt_main.run

let () =
  match fetch_nfts () with
  | _, resp ->
      let str = Cohttp_lwt.Body.to_string resp |> Lwt_main.run in
      write str

type event = string
type title = string
type timeline = { events : event list; title : title option }

let resp_encoding =
  Json_encoding.(
    conv
      (fun { events; title } -> (events, title))
      (fun (events, title) -> { events; title })
      (obj2
         (req "events" (list Json_encoding.string))
         (opt "title" Json_encoding.string)))

let test =
  let json =
    Json_encoding.construct resp_encoding
      { title = Some "title1"; events = [ "event1"; "event2" ] }
  in
  EzAPIServerUtils.return @@ Ok (Utils.write_json json "database.json")
