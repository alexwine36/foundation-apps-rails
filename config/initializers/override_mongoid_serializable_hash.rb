module Mongoid
  module Document   

    def serializable_hash(options={})
      attrs = super
      attrs['id'] = attrs.delete('_id').to_s
      attrs
    end

  end
end