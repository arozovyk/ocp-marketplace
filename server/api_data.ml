open Data_types
let resp_encoding =
  Json_encoding.(
    conv
      (fun { events; title } -> (events, title))
      (fun (events, title) -> { events; title })
      (obj2
         (req "events" (list Json_encoding.string))
         (opt "title" Json_encoding.string)))