module Graphql_cohttp_lwt =
  Graphql_cohttp.Make (Graphql_lwt.Schema) (Cohttp_lwt_unix.IO)
    (Cohttp_lwt.Body)

type user = { id : int }

let user =
  Graphql_lwt.Schema.(
    obj "user" ~doc:"some user" ~fields:(fun _info ->
        [
          field "id"  ~typ:(non_null int) ~doc:"Unique user identifier"
            ~args:Arg.[]
            ~resolve:(fun _info user -> user.id);
        ]))

let schema =
  Graphql_lwt.Schema.(
    schema
      [
        field "users"
          ~typ:(non_null (list (non_null user)))
          ~args:Arg.[ arg "id" ~typ:int ]
          ~resolve:(fun _info () id ->
            match id with
            | None -> []
            | Some id' -> (
                match
                  List.find_opt (fun { id; _ } -> id = id') hardcoded_users
                with
                | None -> []
                | Some user -> [ user ]));
      ])

let req () =
  let query = "{ users {id} }" in
  let query = Some [ ("query", [ query ]) ] in
  let uri =
    Uri.with_uri ~query
      (Uri.of_string
         "https://api.thegraph.com/subgraphs/name/arozovyk/nftmarketplace")
  in
  Lwt_main.run
    (Graphql_cohttp_lwt.execute_request schema ()
       (Cohttp.Request.make ~meth:`POST uri)
       Cohttp_lwt.Body.empty)

let () =
  match req () with
  | `Expert _ -> ()
  | `Response (_, _body') -> (
      match _body' with
      | `String s -> print_endline s
      | `Strings _ -> print_endline "many"
      | _ -> ())
