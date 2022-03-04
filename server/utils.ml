let write message =
  let oc = open_out "ocamlnft.json" in
  Printf.fprintf oc "%s\n" message;
  close_out oc

let write_json json f =
  let chan = open_out f in
  let yojson = Json_repr.to_yojson json in
  let str =
    Format.asprintf "%a" (Json_repr.pp (module Json_repr.Yojson)) yojson
  in
  output_string chan str;
  close_out chan

let eq_lowercase a b =
  String.equal (String.lowercase_ascii a) (String.lowercase_ascii b)

module S = Set.Make (String)
module M = Map.Make (String)
