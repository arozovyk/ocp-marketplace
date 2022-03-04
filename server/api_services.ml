open EzAPI
open Json_encoding

let api_root =
  match Some "api" with
  (* TODO make it configurable *)
  | None -> Path.root
  | Some p -> Path.(root // p)

type nonrec ('a, 'b) post_service0 =
  ('a, 'b, string, EzAPI.Security.none) post_service0

let not_found s = EzAPIServerUtils.return (Error ("Error 404: " ^ s))

let write message =
  let oc = open_out "ocamlnft.json" in
  Printf.fprintf oc "%s\n" message;
  close_out oc

let login : (string * string, Data_types.collections) post_service0 =
  post_service ~name:"login" ~input:(tup2 string string)
    ~output:Api_data.collections_encoding
    Path.(api_root // "login")
 